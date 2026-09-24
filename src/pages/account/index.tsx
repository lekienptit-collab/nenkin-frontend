import { t } from '@/utils/t';
import ImageUploader from '@/components/ImageUploader';
import { mediaUrl } from '@/services/nenkin/masterData';
import { updateMe, updatePasswordMe } from '@/services/nenkin/user';
import { getErrorCode } from '@/utils/error';
import { logoutToken } from '@/utils/token';
import { PageContainer, ProForm, ProFormDatePicker, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, Form, message, Tabs } from 'antd';
import React from 'react';
import styles from './index.less';

const Account: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  const handleUpdateProfile = async (values: API.UserUpdateMeForm) => {
    try {
      await updateMe(values);
      message.success(t('Đã cập nhật thông tin.'));
      const userInfo = await initialState?.fetchAllInfo?.();
      if (userInfo) {
        await setInitialState((s) => ({ ...s, currentUser: userInfo }));
      }
      return true;
    } catch (error) {
      const code = getErrorCode(error);
      message.error(
        code === 'Email already exists'
          ? t('Email đã được sử dụng.')
          : t('Cập nhật bị lỗi.'),
      );
      return false;
    }
  };

  const handleUpdatePassword = async (values: API.UserUpdatePasswordForm) => {
    try {
      await updatePasswordMe(values);
      message.success(t('Đổi mật khẩu thành công. Vui lòng đăng nhập lại.'));
      // Backend thu hoi toan bo phien sau khi doi mat khau.
      logoutToken();
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 1200);
      return true;
    } catch (error) {
      const code = getErrorCode(error);
      message.error(
        code === 'Wrong old password'
          ? t('Mật khẩu hiện tại không đúng.')
          : t('Đổi mật khẩu bị lỗi.'),
      );
      return false;
    }
  };

  return (
    <PageContainer title={t('Thông tin cá nhân')}>
      <div className={styles.profile}>
        <span className={styles.blob} />
        <div className={styles.profileMain}>
          <div className={styles.avatar}>
            {currentUser?.avatar ? (
              <img
                src={mediaUrl(currentUser.avatar)}
                alt={t('Ảnh đại diện')}
                className={styles.avatarImg}
              />
            ) : (
              (currentUser?.fullname || currentUser?.username || 'N')
                .charAt(0)
                .toUpperCase()
            )}
          </div>
          <div className={styles.profileText}>
            <div className={styles.name}>
              {currentUser?.fullname || currentUser?.username || '-'}
            </div>
            <div className={styles.sub}>
              @{currentUser?.username} · {currentUser?.email || t('chưa có email')}
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaTag}>
                {t('Vai trò')}: {currentUser?.roleName || t('chưa gán')}
              </span>
              <span className={styles.metaTag}>
                {t('Số quyền')}:{' '}
                {currentUser?.permissions?.includes('all')
                  ? t('Toàn quyền')
                  : currentUser?.permissions?.length || 0}
              </span>
              <span className={styles.metaTag}>
                {currentUser?.isActive ? t('Đang hoạt động') : t('Đã khoá')}
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
              label: t('Thông tin cơ bản'),
              children: (
                <ProForm<API.UserUpdateMeForm>
                  layout="horizontal"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 12 }}
                  initialValues={{
                    avatar: currentUser?.avatar,
                    email: currentUser?.email,
                    fullname: currentUser?.fullname,
                    phone: currentUser?.phone,
                    address: currentUser?.address,
                    birthday: currentUser?.birthday,
                    note: currentUser?.note,
                  }}
                  submitter={{ searchConfig: { submitText: t('Lưu thay đổi') }, render: (_, dom) => dom[1] }}
                  onFinish={handleUpdateProfile}
                >
                  <Form.Item name="avatar" label={t('Ảnh đại diện')}>
                    <ImageUploader width={96} />
                  </Form.Item>
                  <ProFormText
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: t('Vui lòng nhập email') },
                      { type: 'email', message: t('Email không hợp lệ') },
                    ]}
                  />
                  <ProFormText name="fullname" label={t('Họ và tên')} />
                  <ProFormText name="phone" label={t('Điện thoại')} />
                  <ProFormText name="address" label={t('Địa chỉ')} />
                  <ProFormDatePicker name="birthday" label={t('Ngày sinh')} width="lg" />
                  <ProFormTextArea name="note" label={t('Ghi chú')} />
                </ProForm>
              ),
            },
            {
              key: 'password',
              label: t('Đổi mật khẩu'),
              children: (
                <ProForm<API.UserUpdatePasswordForm>
                  layout="horizontal"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 12 }}
                  submitter={{ searchConfig: { submitText: t('Đổi mật khẩu') }, render: (_, dom) => dom[1] }}
                  onFinish={handleUpdatePassword}
                >
                  <ProFormText.Password
                    name="oldPassword"
                    label={t('Mật khẩu hiện tại')}
                    rules={[{ required: true, message: t('Vui lòng nhập mật khẩu hiện tại') }]}
                  />
                  <ProFormText.Password
                    name="newPassword"
                    label={t('Mật khẩu mới')}
                    rules={[
                      { required: true, message: t('Vui lòng nhập mật khẩu mới') },
                      { min: 8, message: t('Mật khẩu tối thiểu 8 ký tự') },
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
