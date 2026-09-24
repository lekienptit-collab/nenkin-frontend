import { t, tv } from '@/utils/t';
import { NENKIN_RESULT, SERVICE_TYPE } from '@/constants/nenkin';
import { DatePicker, Form, Modal, Radio, Typography } from 'antd';
import { toApiDate } from '@/utils/date';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';

export type NenkinResultModalProps = {
  open: boolean;
  worker?: API.WorkerListItem;
  serviceType: API.NenkinServiceType;
  onCancel: () => void;
  onSubmit: (values: API.UpdateNenkinResultForm) => Promise<void>;
};

/**
 * Doi trang thai "da tra ket qua Nenkin" cho 1 lan thu tuc.
 * O chon ngay chi hien khi chon "Da tra ket qua".
 */
const NenkinResultModal: React.FC<NenkinResultModalProps> = ({
  open,
  worker,
  serviceType,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const result = Form.useWatch('result', form);
  const isFirst = serviceType === SERVICE_TYPE.FIRST;

  useEffect(() => {
    if (!open || !worker) return;
    const current = isFirst ? worker.nenkinFirstResult : worker.nenkinSecondResult;
    const currentDate = isFirst ? worker.resultDate1 : worker.resultDate2;
    form.setFieldsValue({
      result: current ?? NENKIN_RESULT.NOT_YET,
      resultDate: currentDate ? dayjs(currentDate) : dayjs(),
    });
  }, [open, worker, isFirst, form]);

  return (
    <Modal
      open={open}
      title={
        <div>
          <div>{worker?.name}</div>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {t('Thay đổi trạng thái hồ sơ và ngày trả kết quả Nenkin lần')}{' '}
            {isFirst ? 1 : 2}
          </Typography.Text>
        </div>
      }
      okText={t('Lưu thay đổi')}
      cancelText={t('Huỷ')}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={async (values) => {
          await onSubmit({
            serviceType,
            result: values.result,
            resultDate:
              values.result === NENKIN_RESULT.RETURNED
                ? toApiDate(values.resultDate)
                : undefined,
          });
        }}
      >
        <Form.Item
          name="result"
          label={tv('Hồ sơ Nenkin lần {n}', { n: isFirst ? 1 : 2 })}
        >
          <Radio.Group>
            <Radio value={NENKIN_RESULT.RETURNED}>{t('Đã trả kết quả')}</Radio>
            <Radio value={NENKIN_RESULT.NOT_YET}>{t('Chưa nộp/chưa trả kết quả')}</Radio>
          </Radio.Group>
        </Form.Item>
        {result === NENKIN_RESULT.RETURNED && (
          <Form.Item
            name="resultDate"
            label={t('Ngày trả kết quả')}
            rules={[{ required: true, message: t('Vui lòng chọn ngày trả kết quả') }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default NenkinResultModal;
