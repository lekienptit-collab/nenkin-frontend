import { t, tv } from '@/utils/t';
import access from '@/access';
import { addRole, removeRole, role as queryRoles, updateRole } from '@/services/nenkin/role';
import { getErrorCode } from '@/utils/error';
import { showTotal } from '@/utils/table';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Button, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { configColumns } from './columns';
import type { FormValueType } from './components/CreateUpdateForm';
import CreateUpdateForm from './components/CreateUpdateForm';

const ERROR_MESSAGES: Record<string, string> = {
  ROLE_SLUG_ALREADY_EXISTS: t('Mã quyền đã tồn tại.'),
  ROLE_NOT_FOUND: t('Không tìm thấy quyền.'),
  'Can not delete role default': t('Không xoá được quyền mặc định hoặc quyền đang có quyền con.'),
  ROLE_HAS_USER: t('Quyền này đang được gán cho thành viên, không thể xoá.'),
};

const showError = (error: any, fallback: string) => {
  const code = getErrorCode(error);
  message.error(ERROR_MESSAGES[code] || fallback);
};

const RoleList: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const checkAccess = access(initialState);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RoleListItem>();
  const [formVisible, setFormVisible] = useState(false);

  const handleAdd = async (fields: FormValueType) => {
    const hide = message.loading(t('Đang tạo...'));
    try {
      await addRole(fields);
      hide();
      message.success(t('Thêm mới thành công!'));
      return true;
    } catch (error) {
      hide();
      showError(error, t('Thêm mới bị lỗi. Xin thử lại!'));
      return false;
    }
  };

  const handleUpdate = async (id: number, fields: FormValueType) => {
    const hide = message.loading(t('Đang cập nhật...'));
    try {
      await updateRole(id, {
        name: fields.name,
        slug: fields.slug,
        roleId: fields.roleId || undefined,
      });
      hide();
      message.success(t('Đã cập nhật thành công.'));
      return true;
    } catch (error) {
      hide();
      showError(error, t('Cập nhật bị lỗi. Xin thử lại!'));
      return false;
    }
  };

  const handleRemove = (record: API.RoleListItem) => {
    Modal.confirm({
      title: tv('Bạn chắc chắn muốn xoá quyền "{name}"?', { name: record.name }),
      okText: t('Xoá'),
      okButtonProps: { danger: true },
      cancelText: t('Huỷ'),
      onOk: async () => {
        try {
          await removeRole(record.id);
          message.success(t('Đã xoá thành công.'));
          actionRef.current?.reload();
        } catch (error) {
          showError(error, t('Quá trình xoá bị lỗi. Xin thử lại!'));
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
    onPermissionAssign: (e) => history.push(`/users/role/permissions?roleId=${e.id}`),
    checkAccess,
  });

  return (
    <PageContainer
      title={t('Quản lý quyền')}
      content={t('Nhóm quyền theo cấp bậc; mỗi nhóm được phân quyền chi tiết tới từng chức năng.')}
    >
      <ProTable<API.RoleListItem, API.RoleQueryParams>
        headerTitle={t('Danh sách quyền')}
        size={TABLE_SIZE}
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 120 }}
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showTotal: showTotal(t('quyền')),
        }}
        toolBarRender={() => [
          checkAccess.createRole && (
            <Button
              type="primary"
              key="create"
              icon={<PlusOutlined />}
              onClick={() => {
                setCurrentRow(undefined);
                setFormVisible(true);
              }}
            >
              {t('Thêm mới')}
            </Button>
          ),
        ]}
        request={async (params) => {
          const res = await queryRoles(params);
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

export default RoleList;
