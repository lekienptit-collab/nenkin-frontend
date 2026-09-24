import { t, tv } from '@/utils/t';
import { getRoles } from '@/services/nenkin/role';
import { ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Alert, Form, Modal } from 'antd';
import React, { useEffect } from 'react';

export type FormValueType = API.RoleCreateForm;

export type CreateUpdateFormProps = {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  modalVisible: boolean;
  values: Partial<API.RoleListItem>;
};

const CreateUpdateForm: React.FC<CreateUpdateFormProps> = ({
  modalVisible,
  onSubmit,
  onCancel,
  values,
}) => {
  const [form] = Form.useForm();
  const isUpdate = !!values?.id;
  // Role mac dinh cua he thong chi doi duoc permission (o man Phan quyen).
  const isSystemRole = isUpdate && values?.isCanEdit === false;

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      name: values?.name,
      slug: values?.slug,
      roleId: values?.roleId,
    });
  }, [form, values]);

  const fetchRoleOptions = async () => {
    const roles = await getRoles();
    return roles
      .filter((r) => r.id !== values?.id)
      .map((r) => ({ label: `${r.name} (${r.slug})`, value: r.id }));
  };

  return (
    <Modal
      title={
        isUpdate
          ? tv('Cập nhật quyền: {name}', { name: values.name })
          : t('Tạo quyền mới')
      }
      width={640}
      open={modalVisible}
      onCancel={onCancel}
      okText={isUpdate ? t('Cập nhật') : t('Tạo mới')}
      cancelText={t('Huỷ')}
      onOk={() => form.submit()}
      destroyOnClose
    >
      {isSystemRole && (
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
          message={t('Đây là quyền mặc định của hệ thống, không đổi được tên và mã. Bạn vẫn có thể chỉnh permission ở màn hình Phân quyền.')}
        />
      )}

      <ProForm
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 17 }}
        submitter={false}
        onFinish={async (v) => onSubmit(v as FormValueType)}
      >
        <ProFormText
          name="name"
          label={t('Tên quyền')}
          disabled={isSystemRole}
          rules={[{ required: true, message: t('Vui lòng nhập tên quyền') }]}
        />
        <ProFormText
          name="slug"
          label={t('Mã quyền')}
          disabled={isSystemRole}
          tooltip={t('Chỉ gồm chữ thường, số, dấu - và _')}
          rules={[
            { required: true, message: t('Vui lòng nhập mã quyền') },
            {
              pattern: /^[a-z0-9-_]+$/,
              message: t('Chỉ gồm chữ thường, số, dấu - và _'),
            },
          ]}
        />
        <ProFormSelect
          name="roleId"
          label={t('Quyền cha')}
          disabled={isSystemRole}
          request={fetchRoleOptions}
          tooltip={t('Quyền con không được vượt quá permission của quyền cha')}
        />
      </ProForm>
    </Modal>
  );
};

export default CreateUpdateForm;
