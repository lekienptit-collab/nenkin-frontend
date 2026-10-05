import { t, tv, tOptions } from '@/utils/t';
import TaxOfficeInfo, { shortTaxOfficeName } from '@/components/TaxOfficeInfo';
import {
  CASE_TYPE,
  CASE_TYPE_OPTIONS,
  OPTION_OTHERS,
  SERVICE_TYPE,
  SERVICE_TYPE_LABELS,
} from '@/constants/nenkin';
import { searchAgents } from '@/services/nenkin/agent';
import {
  masterData as queryMasterData,
  suggestTaxOffice,
  taxOffices as queryTaxOffices,
} from '@/services/nenkin/masterData';
import { nenkinProcedures, saveNenkinProcedure } from '@/services/nenkin/nenkinService';
import { getWorker, searchWorkers } from '@/services/nenkin/worker';
import { toApiDate } from '@/utils/date';
import { getErrorCode } from '@/utils/error';
import { RobotOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { history, useParams, useSearchParams } from '@umijs/max';
import { Alert, Button, Card, Form, message, Select, Space, Spin, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useFetch } from '@/utils/useFetch';

const ERROR_MESSAGES: Record<string, string> = {
  WORKER_NOT_FOUND: t('Không tìm thấy người lao động.'),
  AGENT_NOT_FOUND: t('Không tìm thấy người đại diện.'),
  ValidationError: t('Dữ liệu chưa hợp lệ, vui lòng kiểm tra lại các ô đã nhập.'),
};

const showError = (error: any, fallback: string) => {
  const code = getErrorCode(error);
  message.error(ERROR_MESSAGES[code] || fallback);
};

const today = () => dayjs().format('YYYY-MM-DD');

/** Địa chỉ cuối cùng ở Nhật, dạng gửi cho API gợi ý sở thuế. */
const jpAddressOf = (worker?: API.WorkerListItem) =>
  [worker?.addressJpDistrict, worker?.addressJpHouseNumber].filter(Boolean).join('');

const NenkinRequest: React.FC = () => {
  const { serviceType: serviceTypeParam } = useParams<{ serviceType: string }>();
  const serviceType = Number(serviceTypeParam) as API.NenkinServiceType;
  const isFirst = serviceType === SERVICE_TYPE.FIRST;

  const [searchParams] = useSearchParams();
  const presetWorkerId = searchParams.get('workerId');

  const [form] = Form.useForm();
  const relation = Form.useWatch('relationOption', form);
  const caseType = Form.useWatch('caseType', form);
  const workerId = Form.useWatch('workerId', form);
  const taxOffice = Form.useWatch('taxOffice', form);
  // Người quay lại Nhật tự khai thuế nên không cần người đại diện nộp thuế.
  const needsAgent = caseType !== CASE_TYPE.RETURN_JAPAN;
  const { data: master } = useFetch<API.MasterData>(() => queryMasterData());
  const { data: taxOfficeList } = useFetch<API.TaxOfficeList>(() => queryTaxOffices(), [], {
    ready: !isFirst,
  });

  const [worker, setWorker] = useState<API.WorkerListItem>();
  const [suggestion, setSuggestion] = useState<API.TaxOfficeSuggestion>();
  const [suggesting, setSuggesting] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      caseType: CASE_TYPE.RETURN_HOME,
      workerId: presetWorkerId ? Number(presetWorkerId) : undefined,
      requestDate: today(),
      entrustDate: today(),
      taxRequestDate: today(),
      taxEntrustDate: today(),
    });
  }, [presetWorkerId, form]);

  /**
   * Lần 2: chọn người lao động thì điền sẵn ngày có kết quả lần 1 đã lưu trong
   * hồ sơ, và tìm sở thuế phụ trách địa chỉ cuối cùng ở Nhật của họ. Làm lại
   * hồ sơ thì giữ sở thuế đã chọn lần trước.
   */
  useEffect(() => {
    if (isFirst || !workerId) {
      setWorker(undefined);
      setSuggestion(undefined);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      setSuggesting(true);
      try {
        const [detail, existing] = await Promise.all([
          getWorker(workerId),
          nenkinProcedures(
            { workerId, serviceType: SERVICE_TYPE.SECOND },
            { skipErrorHandler: true },
          ).catch(() => undefined),
        ]);
        if (cancelled) return;
        setWorker(detail);
        form.setFieldValue('resultDate1', detail.resultDate1 || undefined);

        const address = jpAddressOf(detail);
        const suggested =
          detail.addressJpPrefectureCode && address
            ? await suggestTaxOffice(detail.addressJpPrefectureCode, address, {
                skipErrorHandler: true,
              }).catch(() => undefined)
            : undefined;
        if (cancelled) return;
        setSuggestion(suggested);

        const previous = existing?.data?.[0]?.taxOffice;
        form.setFieldValue(
          'taxOffice',
          previous ? shortTaxOfficeName(previous) : suggested?.office?.name,
        );
      } catch (error) {
        if (!cancelled) setWorker(undefined);
      } finally {
        if (!cancelled) setSuggesting(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [workerId, isFirst, form]);

  /** Sở trong tỉnh của người lao động đứng đầu danh sách chọn. */
  const taxOfficeOptions = useMemo(() => {
    const prefecture = worker?.addressJpPrefectureCode;
    const offices = [...(taxOfficeList?.data || [])].sort(
      (a, b) =>
        Number(b.prefectureCode === prefecture) - Number(a.prefectureCode === prefecture) ||
        Number(a.prefectureCode) - Number(b.prefectureCode),
    );
    const options = offices.map((o) => ({
      value: o.name,
      label: `${o.fullName}（${o.prefecture}）`,
      search: `${o.name}${o.fullName}${o.kana || ''}${o.prefecture}`,
    }));
    // Hồ sơ cũ có thể lưu tên không có trong danh sách của 国税庁.
    const current = shortTaxOfficeName(taxOffice);
    if (current && !offices.some((o) => o.name === current)) {
      options.unshift({ value: current, label: current, search: current });
    }
    return options;
  }, [taxOfficeList, worker, taxOffice]);

  const selectedOffice = taxOfficeList?.data?.find(
    (o) => o.name === shortTaxOfficeName(taxOffice),
  );
  const suggestedOffice = suggestion?.office;

  const handleFinish = async (values: any) => {
    const withAgent = values.caseType !== CASE_TYPE.RETURN_JAPAN;
    const payload: API.NenkinProcedureForm = {
      serviceType,
      workerId: values.workerId,
      caseType: values.caseType,
      agentId: withAgent ? values.agentId : undefined,
      relation: withAgent
        ? values.relationOption === OPTION_OTHERS
          ? values.relationCustom
          : values.relationOption
        : undefined,
      ...(isFirst
        ? {
            requestDate: toApiDate(values.requestDate),
            entrustDate: toApiDate(values.entrustDate),
          }
        : {
            taxRequestDate: toApiDate(values.taxRequestDate),
            taxEntrustDate: toApiDate(values.taxEntrustDate),
            taxOffice: values.taxOffice,
            resultDate1: toApiDate(values.resultDate1),
          }),
    };

    try {
      const result = await saveNenkinProcedure(payload);
      if (result?.missingFields?.length) {
        message.warning(
          tv('Đã tạo hồ sơ, nhưng người lao động còn thiếu: {fields}.', {
            fields: result.missingFields.map((m) => t(m.label)).join(', '),
          }),
        );
      } else {
        message.success(t('Đã tạo hồ sơ thành công.'));
      }
      history.push(`/workers/${payload.workerId}`);
    } catch (error) {
      showError(error, t('Tạo hồ sơ bị lỗi. Xin thử lại!'));
    }
  };

  /** Dòng giải thích vì sao hệ thống gợi ý sở này. */
  const suggestionNote = () => {
    if (!worker) return null;
    if (!worker.addressJpPrefectureCode || !jpAddressOf(worker)) {
      return (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 12 }}
          message={t('Người lao động chưa có địa chỉ cuối cùng ở Nhật nên chưa tìm được sở thuế. Hãy bổ sung địa chỉ trong hồ sơ hoặc chọn tay.')}
        />
      );
    }
    if (!suggestion) return null;
    if (suggestedOffice) {
      return (
        <Space wrap style={{ marginBottom: 8 }}>
          {suggestion.method === 'ai' ? (
            <Tag icon={<RobotOutlined />} color="purple">
              {t('AI gợi ý — hãy kiểm tra lại')}
            </Tag>
          ) : (
            <Tag color="green">{t('Tra theo khu vực quản lý của NTA')}</Tag>
          )}
          <Typography.Text type="secondary">
            {tv('Gợi ý theo địa chỉ cuối cùng ở Nhật: {office}', {
              office: suggestedOffice.fullName,
            })}
            {suggestion.reason ? ` — ${suggestion.reason}` : ''}
          </Typography.Text>
          {shortTaxOfficeName(taxOffice) !== suggestedOffice.name && (
            <Typography.Link
              onClick={() => form.setFieldValue('taxOffice', suggestedOffice.name)}
            >
              {t('Dùng sở này')}
            </Typography.Link>
          )}
        </Space>
      );
    }
    return (
      <Alert
        type="warning"
        showIcon
        style={{ marginBottom: 12 }}
        message={
          suggestion.candidates.length > 1
            ? tv(
                'Khu vực {city} chia cho nhiều sở thuế, hệ thống chưa xác định được. Hãy chọn một trong các sở: {offices}.',
                {
                  city: suggestion.city || '',
                  offices: suggestion.candidates.map((c) => c.fullName).join('、'),
                },
              )
            : t('Không tìm được sở thuế theo địa chỉ, vui lòng chọn tay.')
        }
      />
    );
  };

  return (
    <PageContainer
      title={SERVICE_TYPE_LABELS[serviceType]}
      onBack={() => history.back()}
    >
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <ProForm
          form={form}
          layout="vertical"
          submitter={false}
          onFinish={handleFinish}
          // Ô ngày hiển thị DD/MM/YYYY, nhưng backend nhận chuỗi ISO.
          dateFormatter={(value) => value.format('YYYY-MM-DD')}
        >
          <ProCard bordered style={{ marginBottom: 16 }}>
            <ProFormSelect
              name="workerId"
              label={t('Chọn người lao động')}
              showSearch
              rules={[{ required: true, message: t('Hãy chọn người lao động') }]}
              debounceTime={300}
              request={async ({ keyWords }) => {
                const res = await searchWorkers(keyWords);
                return (res?.data || []).map((w) => ({
                  label: `${w.name} (${
                    w.dateOfBirth ? dayjs(w.dateOfBirth).format('DD/MM/YYYY') : '-'
                  })`,
                  value: w.id,
                }));
              }}
            />

            {!isFirst && (
              <ProFormSelect
                name="caseType"
                label={t('Trường hợp của người lao động')}
                options={CASE_TYPE_OPTIONS}
                allowClear={false}
                tooltip={t('Người quay lại Nhật tự khai thuế nên không cần người đại diện nộp thuế, và bộ hồ sơ bỏ tờ 所得税・消費税の納税管理人の届出書.')}
                rules={[{ required: true, message: t('Hãy chọn trường hợp') }]}
              />
            )}

            {needsAgent && (
              <ProFormSelect
                name="agentId"
                label={t('Chọn người được uỷ quyền')}
                showSearch
                rules={[
                  { required: true, message: t('Hãy chọn người được uỷ quyền') },
                ]}
                debounceTime={300}
                request={async ({ keyWords }) => {
                  const res = await searchAgents(keyWords);
                  return (res?.data || []).map((a) => ({
                    label: a.name,
                    value: a.id,
                  }));
                }}
              />
            )}

            {needsAgent && (
              <ProFormSelect
                name="relationOption"
                label={t('Quan hệ với người được uỷ quyền')}
                options={tOptions(master?.agentRelations)}
                rules={[{ required: true, message: t('Hãy chọn quan hệ') }]}
              />
            )}
            {needsAgent && relation === OPTION_OTHERS && (
              <ProFormText
                name="relationCustom"
                label={t('Quan hệ (tự nhập)')}
                placeholder={t('Vui lòng ghi cụ thể')}
                rules={[{ required: true, message: t('Hãy ghi rõ quan hệ') }]}
              />
            )}
            {!needsAgent && (
              <Alert
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
                message={t('Người lao động quay lại Nhật nên tự khai thuế: không cần người đại diện và bộ hồ sơ bỏ tờ 所得税・消費税の納税管理人の届出書.')}
              />
            )}

            {isFirst ? (
              <>
                <ProFormDatePicker
                  name="requestDate"
                  label={t('Ngày làm đơn')}
                  tooltip={t('Ngày làm đơn phải sau ngày về nước')}
                  fieldProps={{ format: 'DD/MM/YYYY', style: { width: '100%' } }}
                  rules={[{ required: true, message: t('Hãy chọn ngày làm đơn') }]}
                />
                <ProFormDatePicker
                  name="entrustDate"
                  label={t('Ngày uỷ quyền')}
                  fieldProps={{ format: 'DD/MM/YYYY', style: { width: '100%' } }}
                  rules={[{ required: true, message: t('Hãy chọn ngày uỷ quyền') }]}
                />
              </>
            ) : (
              <>
                <ProFormDatePicker
                  name="resultDate1"
                  label={t('Ngày có kết quả Nenkin lần 1')}
                  tooltip={t('Năm khai thuế (年分) trên tờ khai lấy theo năm của ngày này. Hệ thống tự điền theo hồ sơ người lao động; sửa ở đây sẽ cập nhật luôn vào hồ sơ.')}
                  fieldProps={{ format: 'DD/MM/YYYY', style: { width: '100%' } }}
                  rules={[
                    { required: true, message: t('Hãy nhập ngày có kết quả Nenkin lần 1') },
                  ]}
                />
                <ProFormDatePicker
                  name="taxRequestDate"
                  label={t('Ngày làm đơn khai thuế')}
                  fieldProps={{ format: 'DD/MM/YYYY', style: { width: '100%' } }}
                  rules={[{ required: true, message: t('Hãy chọn ngày làm đơn khai thuế') }]}
                />
                <ProFormDatePicker
                  name="taxEntrustDate"
                  label={t('Ngày uỷ quyền khai thuế')}
                  fieldProps={{ format: 'DD/MM/YYYY', style: { width: '100%' } }}
                  rules={[
                    { required: true, message: t('Hãy chọn ngày uỷ quyền khai thuế') },
                  ]}
                />
                <Form.Item
                  label={t('Văn phòng thuế')}
                  tooltip={t('Sở thuế phụ trách địa chỉ cuối cùng ở Nhật của người lao động. Hệ thống tự tìm theo khu vực quản lý của Cục thuế Nhật Bản (NTA); bạn vẫn có thể chọn sở khác.')}
                  style={{ marginBottom: 8 }}
                >
                  <Spin spinning={suggesting}>
                    <Form.Item name="taxOffice" noStyle>
                      <Select
                        showSearch
                        allowClear
                        placeholder={t('Chọn hoặc gõ tên sở thuế, ví dụ: 長尾')}
                        options={taxOfficeOptions}
                        filterOption={(input, option) =>
                          !!option?.search?.toLowerCase().includes(input.trim().toLowerCase())
                        }
                      />
                    </Form.Item>
                  </Spin>
                </Form.Item>
                {suggestionNote()}
                <TaxOfficeInfo
                  office={selectedOffice}
                  searchUrl={taxOfficeList?.searchUrl}
                  style={{ marginBottom: 16 }}
                />
              </>
            )}
          </ProCard>

          <Card>
            <Space>
              <Button onClick={() => history.push('/nenkin')}>{t('Huỷ bỏ')}</Button>
              <Button type="primary" onClick={() => form.submit()}>
                {t('Tạo hồ sơ')}
              </Button>
            </Space>
          </Card>
        </ProForm>
      </div>
    </PageContainer>
  );
};

export default NenkinRequest;
