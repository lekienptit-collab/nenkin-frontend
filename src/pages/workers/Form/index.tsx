import { t, tv } from '@/utils/t';
import { DEFAULT_PENSION_SCHEME, TAX_DEDUCT_FIXED, WORKER_SECTIONS } from '@/constants/nenkin';
import { masterData as queryMasterData } from '@/services/nenkin/masterData';
import { addWorker, getWorker, updateWorker } from '@/services/nenkin/worker';
import { toApiDate, toApiDates } from '@/utils/date';
import { getErrorCode } from '@/utils/error';
import { PageContainer, ProForm } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { Affix, Anchor, Button, Card, Col, Form, message, Row, Space, Spin } from 'antd';
import React, { useEffect } from 'react';
import { useFetch } from '@/utils/useFetch';
import OcrPanel from './OcrPanel';
import {
  AddressSection,
  BankSection,
  InsuranceSection,
  NenkinBookSection,
  PersonalSection,
  ResidenceSection,
  ResultSection,
  TaxSection,
} from './sections';

const ERROR_MESSAGES: Record<string, string> = {
  WORKER_NOT_FOUND: t('Không tìm thấy người lao động.'),
  ValidationError: t('Dữ liệu chưa hợp lệ, vui lòng kiểm tra lại các ô đã nhập.'),
};

const showError = (error: any, fallback: string) => {
  const code = getErrorCode(error);
  message.error(ERROR_MESSAGES[code] || fallback);
};

const WORKER_DATE_FIELDS = ['dateOfBirth', 'leaveJapanDate', 'resultDate1', 'resultDate2'];

/** Chuẩn hoá ngày và số tiền trước khi gửi lên backend. */
const toPayload = (values: any): API.WorkerForm => ({
  ...toApiDates(values, WORKER_DATE_FIELDS),
  taxDeduct: values.taxDeduct === null || values.taxDeduct === undefined
    ? undefined
    : String(values.taxDeduct),
  taxAmount: values.taxAmount === null || values.taxAmount === undefined
    ? undefined
    : String(values.taxAmount),
  netPension: values.netPension === null || values.netPension === undefined
    ? undefined
    : String(values.netPension),
  insuranceHistories: (values.insuranceHistories || [])
    .filter(
      (h: API.InsuranceHistoryItem) =>
        h && (h.workPlace || h.address || h.fromDate || h.toDate),
    )
    .map((h: API.InsuranceHistoryItem) => ({
      ...h,
      pensionScheme: h.pensionScheme ?? DEFAULT_PENSION_SCHEME,
      fromDate: toApiDate(h.fromDate),
      toDate: toApiDate(h.toDate),
    })),
});

const WorkerForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const workerId = id ? Number(id) : undefined;
  const isUpdate = !!workerId;

  const [form] = Form.useForm();

  const { data: master } = useFetch<API.MasterData>(() => queryMasterData());
  const { data: worker, loading } = useFetch<API.WorkerListItem>(
    () => getWorker(workerId!),
    [workerId],
    { ready: isUpdate },
  );

  useEffect(() => {
    if (!isUpdate) {
      form.setFieldsValue({
        country: 'Việt Nam',
        taxDeduct: TAX_DEDUCT_FIXED,
        insuranceHistories: [{ pensionScheme: DEFAULT_PENSION_SCHEME }],
      });
      return;
    }
    if (!worker) return;
    form.setFieldsValue({
      ...worker,
      // Hồ sơ cũ có thể chưa có mức miễn thuế; điền bù cho đủ.
      taxDeduct: worker.taxDeduct ?? TAX_DEDUCT_FIXED,
      insuranceHistories: worker.insuranceHistories?.length
        ? worker.insuranceHistories
        : [{ pensionScheme: DEFAULT_PENSION_SCHEME }],
    });
  }, [worker, isUpdate, form]);

  const handleFinish = async (values: any) => {
    const payload = toPayload(values);
    try {
      if (isUpdate) {
        await updateWorker(workerId!, payload);
        message.success(t('Đã cập nhật thành công.'));
        history.push(`/workers/${workerId}`);
      } else {
        const created = await addWorker(payload);
        message.success(t('Thêm mới thành công!'));
        history.push(`/workers/${created.id}`);
      }
    } catch (error) {
      showError(error, t('Lưu thông tin bị lỗi. Xin thử lại!'));
    }
  };

  const sectionProps = { form, master };

  return (
    <PageContainer
      title={
        isUpdate
          ? tv('Sửa thông tin: {name}', { name: worker?.name || '' })
          : t('Thêm người lao động')
      }
      onBack={() => history.back()}
    >
      <Spin spinning={loading}>
        <ProForm
          form={form}
          layout="vertical"
          submitter={false}
          onFinish={handleFinish}
          // Ô ngày hiển thị DD/MM/YYYY, nhưng backend nhận chuỗi ISO.
          // Để `dateFormatter="string"` thì ProForm gửi theo đúng format hiển thị.
          dateFormatter={(value) => value.format('YYYY-MM-DD')}
        >
          <Row gutter={16}>
            <Col xs={24} lg={18}>
              <OcrPanel {...sectionProps} worker={worker} isUpdate={isUpdate} />
              <PersonalSection {...sectionProps} />
              <AddressSection {...sectionProps} />
              <ResidenceSection {...sectionProps} />
              <NenkinBookSection {...sectionProps} />
              <BankSection {...sectionProps} />
              <TaxSection {...sectionProps} />
              <InsuranceSection {...sectionProps} />
              <ResultSection {...sectionProps} />

              <Card>
                <Space>
                  <Button onClick={() => history.back()}>{t('Quay lại')}</Button>
                  <Button type="primary" onClick={() => form.submit()}>
                    {t('Lưu')}
                  </Button>
                </Space>
              </Card>
            </Col>

            <Col xs={0} lg={6}>
              {/* Header dang o che do fixed (cao 56px) nen phai chua khoang trong. */}
              <Affix offsetTop={80}>
                <Card size="small" title={t('Nội dung biểu mẫu')}>
                  <Anchor
                    affix={false}
                    offsetTop={100}
                    items={WORKER_SECTIONS.map((s) => ({
                      key: s.key,
                      href: `#${s.key}`,
                      title: s.title,
                    }))}
                  />
                </Card>
              </Affix>
            </Col>
          </Row>
        </ProForm>
      </Spin>
    </PageContainer>
  );
};

export default WorkerForm;
