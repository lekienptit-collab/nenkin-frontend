import {
  CASE_TYPE,
  CASE_TYPE_OPTIONS,
  OPTION_OTHERS,
  SERVICE_TYPE,
  SERVICE_TYPE_LABELS,
} from '@/constants/nenkin';
import { searchAgents } from '@/services/nenkin/agent';
import { masterData as queryMasterData } from '@/services/nenkin/masterData';
import { saveNenkinProcedure } from '@/services/nenkin/nenkinService';
import { searchWorkers } from '@/services/nenkin/worker';
import { toApiDate } from '@/utils/date';
import { getErrorCode } from '@/utils/error';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { history, useParams, useSearchParams } from '@umijs/max';
import { Alert, Button, Card, Form, message, Space } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useFetch } from '@/utils/useFetch';

const ERROR_MESSAGES: Record<string, string> = {
  WORKER_NOT_FOUND: 'Không tìm thấy người lao động.',
  AGENT_NOT_FOUND: 'Không tìm thấy người đại diện.',
  NENKIN_FIRST_REQUIRED:
    'Người lao động chưa làm thủ tục lần 1, không thể làm thủ tục lần 2.',
  ValidationError: 'Dữ liệu chưa hợp lệ, vui lòng kiểm tra lại các ô đã nhập.',
};

const showError = (error: any, fallback: string) => {
  const code = getErrorCode(error);
  message.error(ERROR_MESSAGES[code] || fallback);
};

const today = () => dayjs().format('YYYY-MM-DD');

const NenkinRequest: React.FC = () => {
  const { serviceType: serviceTypeParam } = useParams<{ serviceType: string }>();
  const serviceType = Number(serviceTypeParam) as API.NenkinServiceType;
  const isFirst = serviceType === SERVICE_TYPE.FIRST;

  const [searchParams] = useSearchParams();
  const presetWorkerId = searchParams.get('workerId');

  const [form] = Form.useForm();
  const relation = Form.useWatch('relationOption', form);
  const caseType = Form.useWatch('caseType', form);
  // Người quay lại Nhật tự khai thuế nên không cần người đại diện nộp thuế.
  const needsAgent = caseType !== CASE_TYPE.RETURN_JAPAN;
  const { data: master } = useFetch<API.MasterData>(() => queryMasterData());

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
          `Đã tạo hồ sơ, nhưng người lao động còn thiếu: ${result.missingFields
            .map((m) => m.label)
            .join(', ')}.`,
        );
      } else {
        message.success('Đã tạo hồ sơ thành công.');
      }
      history.push(`/workers/${payload.workerId}`);
    } catch (error) {
      showError(error, 'Tạo hồ sơ bị lỗi. Xin thử lại!');
    }
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
              label="Chọn người lao động"
              showSearch
              rules={[{ required: true, message: 'Hãy chọn người lao động' }]}
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
                label="Trường hợp của người lao động"
                options={CASE_TYPE_OPTIONS}
                allowClear={false}
                tooltip="Người quay lại Nhật tự khai thuế nên không cần người đại diện nộp thuế, và bộ hồ sơ bỏ tờ 所得税・消費税の納税管理人の届出書."
                rules={[{ required: true, message: 'Hãy chọn trường hợp' }]}
              />
            )}

            {needsAgent && (
              <ProFormSelect
                name="agentId"
                label="Chọn người được uỷ quyền"
                showSearch
                rules={[
                  { required: true, message: 'Hãy chọn người được uỷ quyền' },
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
                label="Quan hệ với người được uỷ quyền"
                options={master?.agentRelations}
                rules={[{ required: true, message: 'Hãy chọn quan hệ' }]}
              />
            )}
            {needsAgent && relation === OPTION_OTHERS && (
              <ProFormText
                name="relationCustom"
                label="Quan hệ (tự nhập)"
                placeholder="Vui lòng ghi cụ thể"
                rules={[{ required: true, message: 'Hãy ghi rõ quan hệ' }]}
              />
            )}
            {!needsAgent && (
              <Alert
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
                message="Người lao động quay lại Nhật nên tự khai thuế: không cần người đại diện và bộ hồ sơ bỏ tờ 所得税・消費税の納税管理人の届出書."
              />
            )}

            {isFirst ? (
              <>
                <ProFormDatePicker
                  name="requestDate"
                  label="Ngày làm đơn"
                  tooltip="Ngày làm đơn phải sau ngày về nước"
                  fieldProps={{ format: 'DD/MM/YYYY', style: { width: '100%' } }}
                  rules={[{ required: true, message: 'Hãy chọn ngày làm đơn' }]}
                />
                <ProFormDatePicker
                  name="entrustDate"
                  label="Ngày uỷ quyền"
                  fieldProps={{ format: 'DD/MM/YYYY', style: { width: '100%' } }}
                  rules={[{ required: true, message: 'Hãy chọn ngày uỷ quyền' }]}
                />
              </>
            ) : (
              <>
                <Alert
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                  message="Thủ tục lần 2 chỉ làm được sau khi đã làm thủ tục lần 1."
                />
                <ProFormDatePicker
                  name="resultDate1"
                  label="Ngày có kết quả Nenkin lần 1"
                  tooltip="Nhập ở đây sẽ cập nhật luôn vào hồ sơ người lao động"
                  fieldProps={{ format: 'DD/MM/YYYY', style: { width: '100%' } }}
                />
                <ProFormDatePicker
                  name="taxRequestDate"
                  label="Ngày làm đơn khai thuế"
                  fieldProps={{ format: 'DD/MM/YYYY', style: { width: '100%' } }}
                  rules={[{ required: true, message: 'Hãy chọn ngày làm đơn khai thuế' }]}
                />
                <ProFormDatePicker
                  name="taxEntrustDate"
                  label="Ngày uỷ quyền khai thuế"
                  fieldProps={{ format: 'DD/MM/YYYY', style: { width: '100%' } }}
                  rules={[
                    { required: true, message: 'Hãy chọn ngày uỷ quyền khai thuế' },
                  ]}
                />
                <ProFormText
                  name="taxOffice"
                  label="Văn phòng thuế"
                  placeholder="ví dụ: 真岡税務署"
                  tooltip="Văn phòng thuế phụ trách địa chỉ cuối cùng ở Nhật của người lao động"
                />
              </>
            )}
          </ProCard>

          <Card>
            <Space>
              <Button onClick={() => history.push('/nenkin')}>Huỷ bỏ</Button>
              <Button type="primary" onClick={() => form.submit()}>
                Tạo hồ sơ
              </Button>
            </Space>
          </Card>
        </ProForm>
      </div>
    </PageContainer>
  );
};

export default NenkinRequest;
