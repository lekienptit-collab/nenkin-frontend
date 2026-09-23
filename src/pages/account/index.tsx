import { updateMe, updatePasswordMe } from '@/services/nenkin/user';
import { getErrorCode } from '@/utils/error';
import { logoutToken } from '@/utils/token';
import { PageContainer, ProForm, ProFormDatePicker, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, message, Tabs } from 'antd';
import React from 'react';
import styles from './index.less';

const Account: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  const handleUpdateProfile = async (values: API.UserUpdateMeForm) => {
    try {
      await updateMe(values);
      message.success('Đã cập nhật thông tin.');
      const userInfo = await initialState?.fetchAllInfo?.();
      if (userInfo) {
        await setInitialState((s) => ({ ...s, currentUser: userInfo }));
      }
      return true;
    } catch (error) {
      const code = getErrorCode(error);
      message.error(
        code === 'Email already exists' ? 'Email đã được sử dụng.' : 'Cập nhật bị lỗi.',
      );
      return false;
    }
  };

  const handleUpdatePassword = async (values: API.UserUpdatePasswordForm) => {
    try {
      await updatePasswordMe(values);
      message.success('Đổi mật khẩu thành công. Vui lòng đăng nhập lại.');
      // Backend thu hoi toan bo phien sau khi doi mat khau.
      logoutToken();
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 1200);
      return true;
    } catch (error) {
      const code = getErrorCode(error);
      message.error(
        code === 'Wrong old password' ? 'Mật khẩu hiện tại không đúng.' : 'Đổi mật khẩu bị lỗi.',
      );
      return false;
    }
  };

  return (
    <PageContainer title="Thông tin cá nhân">
      <div className={styles.profile}>
        <span className={styles.blob} />
        <div className={styles.profileMain}>
          <div className={styles.avatar}>
            {(currentUser?.fullname || currentUser?.username || 'N').charAt(0).toUpperCase()}
          </div>
          <div className={styles.profileText}>
            <div className={styles.name}>
              {currentUser?.fullname || currentUser?.username || '-'}
            </div>
            <div className={styles.sub}>
              @{currentUser?.username} · {currentUser?.email || 'chưa có email'}
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaTag}>
                Vai trò: {currentUser?.roleName || 'chưa gán'}
              </span>
              <span className={styles.metaTag}>
                Số quyền:{' '}
                {currentUser?.permissions?.includes('all')
                  ? 'Toàn quyền'
                  : currentUser?.permissions?.length || 0}
              </span>
              <span className={styles.metaTag}>
                {currentUser?.isActive ? 'Đang hoạt động' : 'Đã khoá'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <Tabs
          items={[
            {
              key: 'profile',
              label: 'Thông tin cơ bản',
              children: (
                <ProForm<API.UserUpdateMeForm>
                  layout="horizontal"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 12 }}
                  initialValues={{
                    email: currentUser?.email,
                    fullname: currentUser?.fullname,
                    phone: currentUser?.phone,
                    address: currentUser?.address,
                    birthday: currentUser?.birthday,
                    note: currentUser?.note,
                  }}
                  submitter={{ searchConfig: { submitText: 'Lưu thay đổi' }, render: (_, dom) => dom[1] }}
                  onFinish={handleUpdateProfile}
                >
                  <ProFormText
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email' },
                      { type: 'email', message: 'Email không hợp lệ' },
                    ]}
                  />
                  <ProFormText name="fullname" label="Họ và tên" />
                  <ProFormText name="phone" label="Điện thoại" />
                  <ProFormText name="address" label="Địa chỉ" />
                  <ProFormDatePicker name="birthday" label="Ngày sinh" width="lg" />
                  <ProFormTextArea name="note" label="Ghi chú" />
                </ProForm>
              ),
            },
            {
              key: 'password',
              label: 'Đổi mật khẩu',
              children: (
                <ProForm<API.UserUpdatePasswordForm>
                  layout="horizontal"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 12 }}
                  submitter={{ searchConfig: { submitText: 'Đổi mật khẩu' }, render: (_, dom) => dom[1] }}
                  onFinish={handleUpdatePassword}
                >
                  <ProFormText.Password
                    name="oldPassword"
                    label="Mật khẩu hiện tại"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
                  />
                  <ProFormText.Password
                    name="newPassword"
                    label="Mật khẩu mới"
                    rules={[
                      { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                      { min: 8, message: 'Mật khẩu tối thiểu 8 ký tự' },
                    ]}
                  />
                </ProForm>
              ),
            },
          ]}
        />
      </Card>
    </PageContainer>
  );
};

export default Account;
