import { t, tv } from '@/utils/t';
import access from '@/access';
import { agents as queryAgents, deleteAgents } from '@/services/nenkin/agent';
import { getErrorCode } from '@/utils/error';
import { showTotal } from '@/utils/table';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Button, message, Modal } from 'antd';
import React, { useRef } from 'react';
import { configColumns } from './columns';

const ERROR_MESSAGES: Record<string, string> = {
  AGENT_NOT_FOUND: t('Không tìm thấy người đại diện.'),
  AGENT_IN_USE:
    t('Người đại diện đang đứng tên trên hồ sơ Nenkin nên không thể xoá.'),
};

const showError = (error: any, fallback: string) => {
  const code = getErrorCode(error);
  message.error(ERROR_MESSAGES[code] || fallback);
};

const AgentList: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const checkAccess = access(initialState);
  const actionRef = useRef<ActionType>();

  const handleRemove = (record: API.AgentListItem) => {
    Modal.confirm({
      title: tv('Bạn chắc chắn muốn xoá người đại diện "{name}"?', {
        name: record.name,
      }),
      okText: t('Xoá'),
      okButtonProps: { danger: true },
      cancelText: t('Huỷ'),
      onOk: async () => {
        try {
          await deleteAgents([record.id!]);
          message.success(t('Đã xoá thành công.'));
          actionRef.current?.reload();
        } catch (error) {
          showError(error, t('Quá trình xoá bị lỗi. Xin thử lại!'));
        }
      },
    });
  };

  const columns = configColumns({ onDelete: handleRemove, checkAccess });

  return (
    <PageContainer
      title={t('Người đại diện')}
      content={t('Những người được uỷ quyền đứng tên trên hồ sơ Nenkin của người lao động.')}
    >
      <ProTable<API.AgentListItem, API.AgentQueryParams>
        headerTitle={t('Danh sách người đại diện')}
        size={TABLE_SIZE}
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 180 }}
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showTotal: showTotal(t('người đại diện')),
        }}
        toolBarRender={() => [
          checkAccess.createAgent && (
            <Button
              type="primary"
              key="create"
              icon={<PlusOutlined />}
              onClick={() => history.push('/agents/create')}
            >
              {t('Thêm mới')}
            </Button>
          ),
        ]}
        request={async (params) => {
          const res = await queryAgents(params);
          return {
            data: res?.data || [],
            total: res?.total || 0,
            success: true,
          };
        }}
        columns={columns}
      />
    </PageContainer>
  );
};

export default AgentList;
