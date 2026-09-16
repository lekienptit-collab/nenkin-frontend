import { getRoles } from '@/services/nenkin/role';
import {
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form, Modal } from 'antd';
import React, { useEffect } from 'react';

export type FormValueType = API.UserCreateForm & API.UserUpdateForm;

export type CreateUpdateFormProps = {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  modalVisible: boolean;
  values: Partial<API.UserListItem>;
};

const CreateUpdateForm: React.FC<CreateUpdateFormProps> = ({
  modalVisible,
  onSubmit,
  onCancel,
  values,
}) => {
  const [form] = Form.useForm();
  const isUpdate = !!values?.id;

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      username: values?.username,
      email: values?.email,
      fullname: values?.fullname,
      phone: values?.phone,
      address: values?.address,
      birthday: values?.birthday,
      note: values?.note,
      roleId: values?.roleId,
      isActive: values?.isActive ?? true,
    });
  }, [form, values]);

  const fetchRoleOptions = async () => {
    const roles = await getRoles();
    return roles.map((r) => ({ label: `${r.name} (${r.slug})`, value: r.id }));
  };

  return (
    <Modal
      title={isUpdate ? `Cập nhật thành viên: ${values.username}` : 'Thêm thành viên'}
      width={640}
      open={modalVisible}
      onCancel={onCancel}
      okText={isUpdate ? 'Cập nhật' : 'Tạo mới'}
      cancelText="Huỷ"
      onOk={() => form.submit()}
      destroyOnClose
    >
      <ProForm
        form={form}
        layout="horizontal"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 16 }}
        submitter={false}
        onFinish={async (v) => {
          const payload: FormValueType = { ...v };
          // Sua ma de trong mat khau thi giu nguyen mat khau cu.
          if (isUpdate && !payload.password) {
            delete payload.password;
          }
          if (isUpdate) {
            delete (payload as API.UserCreateForm).username;
          }
          await onSubmit(payload);
        }}
      >
        <ProFormText
          name="username"
          label="Tên đăng nhập"
          disabled={isUpdate}
          rules={
            isUpdate
              ? []
              : [
                  { required: true, message: 'Vui lòng nhập tên đăng nhập' },
                  { min: 3, message: 'Tối thiểu 3 ký tự' },
                  {
                    pattern: /^[a-zA-Z0-9._-]+$/,
                    message: 'Chỉ gồm chữ, số và . _ -',
                  },
                ]
          }
        />
        <ProFormText
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        />
        <ProFormText.Password
          name="password"
          label="Mật khẩu"
          tooltip={isUpdate ? 'Để trống nếu không đổi mật khẩu' : undefined}
          rules={
            isUpdate
              ? [{ min: 8, message: 'Mật khẩu tối thiểu 8 ký tự' }]
              : [
                  { required: true, message: 'Vui lòng nhập mật khẩu' },
                  { min: 8, message: 'Mật khẩu tối thiểu 8 ký tự' },
                ]
          }
        />
        <ProFormSelect
          name="roleId"
          label="Vai trò"
          request={fetchRoleOptions}
          rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
        />
        <ProFormText name="fullname" label="Họ và tên" />
        <ProFormText name="phone" label="Điện thoại" />
        <ProFormText name="address" label="Địa chỉ" />
        <ProFormDatePicker name="birthday" label="Ngày sinh" width="lg" />
        <ProFormTextArea name="note" label="Ghi chú" />
        <ProFormSwitch
          name="isActive"
          label="Kích hoạt"
          checkedChildren="Bật"
          unCheckedChildren="Khoá"
        />
      </ProForm>
    </Modal>
  );
};

export default CreateUpdateForm;
