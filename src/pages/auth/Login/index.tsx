import Footer from '@/components/Footer';
import { login } from '@/services/nenkin/auth';
import { getErrorCode } from '@/utils/error';
import { setToken } from '@/utils/token';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Alert, message } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';

const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  'Can not login': 'Sai tên đăng nhập hoặc mật khẩu!',
  USER_HAS_BANNED: 'Tài khoản đã bị khoá. Vui lòng liên hệ quản trị viên.',
};

const LoginMessage: React.FC<{ content: string }> = ({ content }) => (
  <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
);

const Login: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchAllInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      const auth = await login({ ...values });
      setToken(auth);
      await fetchUserInfo();
      message.success('Đăng nhập thành công!');

      const urlParams = new URL(window.location.href).searchParams;
      window.location.href = urlParams.get('redirect') || '/';
    } catch (error: any) {
      const code = getErrorCode(error);
      setErrorMessage(LOGIN_ERROR_MESSAGES[code] || 'Sai tên đăng nhập hoặc mật khẩu!');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          title="Nenkin"
          subTitle="Hệ thống quản trị"
          initialValues={{ autoLogin: false }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
          submitter={{ searchConfig: { submitText: 'Đăng nhập' } }}
        >
          {errorMessage && <LoginMessage content={errorMessage} />}

          <ProFormText
            name="username"
            fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
            placeholder="Tên đăng nhập hoặc email"
            rules={[{ required: true, message: 'Bạn cần nhập username hoặc email!' }]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
            placeholder="Mật khẩu"
            rules={[{ required: true, message: 'Bạn cần nhập mật khẩu!' }]}
          />
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
