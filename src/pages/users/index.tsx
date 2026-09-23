import access from '@/access';
import {
  addUser,
  banUnBanUser,
  deleteUsers,
  updateUser,
  users as queryUsers,
} from '@/services/nenkin/user';
import { getErrorCode } from '@/utils/error';
import { showTotal } from '@/utils/table';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { configColumns } from './columns';
import type { FormValueType } from './components/CreateUpdateForm';
import CreateUpdateForm from './components/CreateUpdateForm';

const ERROR_MESSAGES: Record<string, string> = {
  'Username already exists': 'Tên đăng nhập đã tồn tại.',
  'Email already exists': 'Email đã được sử dụng.',
  ROLE_NOT_FOUND: 'Vai trò không tồn tại.',
  USER_NOT_FOUND: 'Không tìm thấy thành viên.',
  CAN_NOT_DELETE_YOURSELF: 'Không thể xoá chính tài khoản của bạn.',
  CAN_NOT_BAN_YOURSELF: 'Không thể khoá chính tài khoản của bạn.',
};

const showError = (error: any, fallback: string) => {
  const code = getErrorCode(error);
  message.error(ERROR_MESSAGES[code] || fallback);
};

const UserList: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const checkAccess = access(initialState);
  const currentUserId = initialState?.currentUser?.id;

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.UserListItem>();
  const [formVisible, setFormVisible] = useState(false);

  const handleAdd = async (fields: FormValueType) => {
    const hide = message.loading('Đang tạo...');
    try {
      await addUser(fields);
      hide();
      message.success('Thêm mới thành công!');
      return true;
    } catch (error) {
      hide();
      showError(error, 'Thêm mới bị lỗi. Xin thử lại!');
      return false;
    }
  };

  const handleUpdate = async (id: string, fields: FormValueType) => {
    const hide = message.loading('Đang cập nhật...');
    try {
      await updateUser(id, fields);
      hide();
      message.success('Đã cập nhật thành công.');
      return true;
    } catch (error) {
      hide();
      showError(error, 'Cập nhật bị lỗi. Xin thử lại!');
      return false;
    }
  };

  const handleToggleActive = async (record: API.UserListItem, isActive: boolean) => {
    try {
      await banUnBanUser(record.id!, isActive);
      message.success(isActive ? 'Đã mở khoá tài khoản.' : 'Đã khoá tài khoản.');
      actionRef.current?.reload();
    } catch (error) {
      showError(error, 'Thao tác bị lỗi. Xin thử lại!');
    }
  };

  const handleRemove = (record: API.UserListItem) => {
    Modal.confirm({
      title: `Bạn chắc chắn muốn xoá thành viên "${record.username}"?`,
      okText: 'Xoá',
      okButtonProps: { danger: true },
      cancelText: 'Huỷ',
      onOk: async () => {
        try {
          await deleteUsers([record.id!]);
          message.success('Đã xoá thành công.');
          actionRef.current?.reload();
        } catch (error) {
          showError(error, 'Quá trình xoá bị lỗi. Xin thử lại!');
        }
      },
    });
  };

  const columns = configColumns({
    onUpdate: (e) => {
      setCurrentRow(e);
      setFormVisible(true);
    },
    onDelete: handleRemove,
    onToggleActive: handleToggleActive,
    checkAccess,
    currentUserId,
  });

  return (
    <PageContainer
      title="Quản lý thành viên"
      content="Tài khoản nhân viên đang sử dụng hệ thống và vai trò được gán cho từng người."
    >
      <ProTable<API.UserListItem, API.UserQueryParams>
        headerTitle="Danh sách thành viên"
        size={TABLE_SIZE}
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 120 }}
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showTotal: showTotal('thành viên'),
        }}
        toolBarRender={() => [
          checkAccess.createUser && (
            <Button
              type="primary"
              key="create"
              icon={<PlusOutlined />}
              onClick={() => {
                setCurrentRow(undefined);
                setFormVisible(true);
              }}
            >
              Thêm mới
            </Button>
          ),
        ]}
        request={async (params) => {
          const res = await queryUsers(params);
          return {
            data: res?.data || [],
            total: res?.total || 0,
            success: true,
          };
        }}
        columns={columns}
      />

      {formVisible && (
        <CreateUpdateForm
          modalVisible={formVisible}
          values={currentRow || {}}
          onCancel={() => {
            setFormVisible(false);
            setCurrentRow(undefined);
          }}
          onSubmit={async (value) => {
            const success = currentRow?.id
              ? await handleUpdate(currentRow.id, value)
              : await handleAdd(value);
            if (success) {
              setFormVisible(false);
              setCurrentRow(undefined);
              actionRef.current?.reload();
            }
          }}
        />
      )}
    </PageContainer>
  );
};

export default UserList;
