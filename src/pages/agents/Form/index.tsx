import { t, tv } from '@/utils/t';
import SegmentedInput from '@/components/SegmentedInput';
import { JP_POSTAL_CODE_PATTERN } from '@/constants/nenkin';
import { addAgent, getAgent, updateAgent } from '@/services/nenkin/agent';
import { masterData as queryMasterData } from '@/services/nenkin/masterData';
import { getErrorCode } from '@/utils/error';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { Button, Card, Col, Form, message, Row, Space, Spin } from 'antd';
import React, { useEffect } from 'react';
import { useFetch } from '@/utils/useFetch';

const ERROR_MESSAGES: Record<string, string> = {
  AGENT_NOT_FOUND: t('Không tìm thấy người đại diện.'),
  ValidationError: t('Dữ liệu chưa hợp lệ, vui lòng kiểm tra lại các ô đã nhập.'),
};

const showError = (error: any, fallback: string) => {
  const code = getErrorCode(error);
  message.error(ERROR_MESSAGES[code] || fallback);
};

const twoCols = { xs: 24, md: 12 };

const AgentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const agentId = id ? Number(id) : undefined;
  const isUpdate = !!agentId;

  const [form] = Form.useForm();
  const { data: master } = useFetch<API.MasterData>(() => queryMasterData());
  const { data: agent, loading } = useFetch<API.AgentListItem>(
    () => getAgent(agentId!),
    [agentId],
    { ready: isUpdate },
  );

  useEffect(() => {
    if (isUpdate && agent) {
      form.setFieldsValue(agent);
    }
  }, [agent, isUpdate, form]);

  const handleFinish = async (values: API.AgentForm) => {
    try {
      if (isUpdate) {
        await updateAgent(agentId!, values);
        message.success(t('Đã cập nhật thành công.'));
        history.push(`/agents/${agentId}`);
      } else {
        const created = await addAgent(values);
        message.success(t('Thêm mới thành công!'));
        history.push(`/agents/${created.id}`);
      }
    } catch (error) {
      showError(error, t('Lưu thông tin bị lỗi. Xin thử lại!'));
    }
  };

  return (
    <PageContainer
      title={
        isUpdate
          ? tv('Sửa thông tin: {name}', { name: agent?.name || '' })
          : t('Thêm người đại diện')
      }
      onBack={() => history.back()}
    >
      <Spin spinning={loading}>
        <ProForm form={form} layout="vertical" submitter={false} onFinish={handleFinish}>
          <ProCard title={t('Thông tin cá nhân')} bordered style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col {...twoCols}>
                <ProFormText
                  name="name"
                  label={t('Họ và tên')}
                  rules={[{ required: true, message: t('Vui lòng nhập họ và tên') }]}
                />
              </Col>
              <Col {...twoCols}>
                <ProFormText name="nameFurigana" label={t('Họ và tên (phiên âm)')} />
              </Col>
              <Col {...twoCols}>
                <Form.Item name="phoneNumber" label={t('Số điện thoại')}>
                  <SegmentedInput
                    segments={[4, 4, 4]}
                    placeholders={['080', '8045', '0561']}
                  />
                </Form.Item>
              </Col>
              <Col {...twoCols}>
                <ProFormText
                  name="occupation"
                  label={t('Nghề nghiệp ở Nhật Bản')}
                  placeholder={t('ví dụ: 会社員')}
                />
              </Col>
            </Row>
          </ProCard>

          <ProCard title={t('Thông tin tài khoản')} bordered style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col {...twoCols}>
                <ProFormText
                  name="bankName"
                  label={t('Tên ngân hàng')}
                  placeholder={t('ví dụ: 三菱UFJ')}
                />
              </Col>
              <Col {...twoCols}>
                <ProFormText
                  name="bankBranchName"
                  label={t('Tên chi nhánh')}
                  placeholder={t('ví dụ: 小田井')}
                />
              </Col>
              <Col {...twoCols}>
                <ProFormText name="bankAccountName" label={t('Tên tài khoản')} />
              </Col>
              <Col {...twoCols}>
                <ProFormText
                  name="bankAccountNumber"
                  label={t('Số tài khoản')}
                  placeholder={t('ví dụ: 0000000')}
                />
              </Col>
              <Col {...twoCols}>
                <ProFormSelect
                  name="bankAccountType"
                  label={t('Loại tài khoản')}
                  options={(master?.bankAccountTypes || []).map((o) => ({
                    label: t(o.label),
                    value: Number(o.value),
                  }))}
                />
              </Col>
            </Row>
          </ProCard>

          <ProCard title={t('Thông tin địa chỉ ở Nhật')} bordered style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col {...twoCols}>
                <Form.Item
                  name="addressPostalCode"
                  label={t('Mã bưu điện')}
                  rules={[
                    {
                      pattern: JP_POSTAL_CODE_PATTERN,
                      message: t('Mã bưu điện phải có dạng 123-4567'),
                    },
                  ]}
                >
                  <SegmentedInput segments={[3, 4]} placeholders={['123', '4567']} />
                </Form.Item>
              </Col>
              <Col {...twoCols}>
                <ProFormText name="addressDetail" label={t('Địa chỉ đầy đủ')} />
              </Col>
            </Row>
          </ProCard>

          <Card>
            <Space>
              <Button onClick={() => history.back()}>{t('Quay lại')}</Button>
              <Button type="primary" onClick={() => form.submit()}>
                {t('Lưu')}
              </Button>
            </Space>
          </Card>
        </ProForm>
      </Spin>
    </PageContainer>
  );
};

export default AgentForm;
