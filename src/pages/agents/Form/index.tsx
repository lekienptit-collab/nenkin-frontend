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
  AGENT_NOT_FOUND: 'Không tìm thấy người đại diện.',
  ValidationError: 'Dữ liệu chưa hợp lệ, vui lòng kiểm tra lại các ô đã nhập.',
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
        message.success('Đã cập nhật thành công.');
        history.push(`/agents/${agentId}`);
      } else {
        const created = await addAgent(values);
        message.success('Thêm mới thành công!');
        history.push(`/agents/${created.id}`);
      }
    } catch (error) {
      showError(error, 'Lưu thông tin bị lỗi. Xin thử lại!');
    }
  };

  return (
    <PageContainer
      title={isUpdate ? `Sửa thông tin: ${agent?.name || ''}` : 'Thêm người đại diện'}
      onBack={() => history.back()}
    >
      <Spin spinning={loading}>
        <ProForm form={form} layout="vertical" submitter={false} onFinish={handleFinish}>
          <ProCard title="Thông tin cá nhân" bordered style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col {...twoCols}>
                <ProFormText
                  name="name"
                  label="Họ và tên"
                  rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                />
              </Col>
              <Col {...twoCols}>
                <ProFormText name="nameFurigana" label="Họ và tên (phiên âm)" />
              </Col>
              <Col {...twoCols}>
                <Form.Item name="phoneNumber" label="Số điện thoại">
                  <SegmentedInput
                    segments={[4, 4, 4]}
                    placeholders={['080', '8045', '0561']}
                  />
                </Form.Item>
              </Col>
              <Col {...twoCols}>
                <ProFormText
                  name="occupation"
                  label="Nghề nghiệp ở Nhật Bản"
                  placeholder="ví dụ: 会社員"
                />
              </Col>
            </Row>
          </ProCard>

          <ProCard title="Thông tin tài khoản" bordered style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col {...twoCols}>
                <ProFormText
                  name="bankName"
                  label="Tên ngân hàng"
                  placeholder="ví dụ: 三菱UFJ"
                />
              </Col>
              <Col {...twoCols}>
                <ProFormText
                  name="bankBranchName"
                  label="Tên chi nhánh"
                  placeholder="ví dụ: 小田井"
                />
              </Col>
              <Col {...twoCols}>
                <ProFormText name="bankAccountName" label="Tên tài khoản" />
              </Col>
              <Col {...twoCols}>
                <ProFormText
                  name="bankAccountNumber"
                  label="Số tài khoản"
                  placeholder="ví dụ: 0000000"
                />
              </Col>
              <Col {...twoCols}>
                <ProFormSelect
                  name="bankAccountType"
                  label="Loại tài khoản"
                  options={(master?.bankAccountTypes || []).map((t) => ({
                    label: t.label,
                    value: Number(t.value),
                  }))}
                />
              </Col>
            </Row>
          </ProCard>

          <ProCard title="Thông tin địa chỉ ở Nhật" bordered style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col {...twoCols}>
                <Form.Item
                  name="addressPostalCode"
                  label="Mã bưu điện"
                  rules={[
                    {
                      pattern: JP_POSTAL_CODE_PATTERN,
                      message: 'Mã bưu điện phải có dạng 123-4567',
                    },
                  ]}
                >
                  <SegmentedInput segments={[3, 4]} placeholders={['123', '4567']} />
                </Form.Item>
              </Col>
              <Col {...twoCols}>
                <ProFormText name="addressDetail" label="Địa chỉ đầy đủ" />
              </Col>
            </Row>
          </ProCard>

          <Card>
            <Space>
              <Button onClick={() => history.back()}>Quay lại</Button>
              <Button type="primary" onClick={() => form.submit()}>
                Lưu
              </Button>
            </Space>
          </Card>
        </ProForm>
      </Spin>
    </PageContainer>
  );
};

export default AgentForm;
