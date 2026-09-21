import access from '@/access';
import { getAgent } from '@/services/nenkin/agent';
import { masterData as queryMasterData } from '@/services/nenkin/masterData';
import { EditOutlined } from '@ant-design/icons';
import { PageContainer, ProCard, ProDescriptions } from '@ant-design/pro-components';
import { history, Link, useModel, useParams } from '@umijs/max';
import { Button } from 'antd';
import React from 'react';
import { useFetch } from '@/utils/useFetch';

const AgentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const agentId = Number(id);
  const { initialState } = useModel('@@initialState');
  const checkAccess = access(initialState);

  const { data: master } = useFetch<API.MasterData>(() => queryMasterData());
  const { data: agent, loading } = useFetch<API.AgentListItem>(
    () => getAgent(agentId),
    [agentId],
  );

  const accountTypeLabel =
    master?.bankAccountTypes?.find(
      (t) => Number(t.value) === agent?.bankAccountType,
    )?.label || '-';

  return (
    <PageContainer
      title={agent?.name || 'Chi tiết người đại diện'}
      loading={loading}
      onBack={() => history.back()}
      extra={
        checkAccess.updateAgent && (
          <Link to={`/agents/${agentId}/edit`}>
            <Button type="primary" icon={<EditOutlined />}>
              Thay đổi
            </Button>
          </Link>
        )
      }
    >
      <ProCard title="Thông tin cơ bản" bordered style={{ marginBottom: 16 }}>
        <ProDescriptions column={{ xs: 1, md: 2 }}>
          <ProDescriptions.Item label="Họ và tên">{agent?.name}</ProDescriptions.Item>
          <ProDescriptions.Item label="Họ và tên (phiên âm)">
            {agent?.nameFurigana || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Số điện thoại">
            {agent?.phoneNumber || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Nghề nghiệp ở Nhật Bản">
            {agent?.occupation || '-'}
          </ProDescriptions.Item>
        </ProDescriptions>
      </ProCard>

      <ProCard title="Thông tin tài khoản" bordered style={{ marginBottom: 16 }}>
        <ProDescriptions column={{ xs: 1, md: 2 }}>
          <ProDescriptions.Item label="Tên ngân hàng">
            {agent?.bankName || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Tên chi nhánh">
            {agent?.bankBranchName || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Tên tài khoản">
            {agent?.bankAccountName || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Số tài khoản">
            {agent?.bankAccountNumber || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Loại tài khoản">
            {accountTypeLabel}
          </ProDescriptions.Item>
        </ProDescriptions>
      </ProCard>

      <ProCard title="Thông tin địa chỉ ở Nhật" bordered>
        <ProDescriptions column={{ xs: 1, md: 2 }}>
          <ProDescriptions.Item label="Mã bưu điện">
            {agent?.addressPostalCode || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Địa chỉ đầy đủ">
            {agent?.addressDetail || '-'}
          </ProDescriptions.Item>
        </ProDescriptions>
      </ProCard>
    </PageContainer>
  );
};

export default AgentDetail;
