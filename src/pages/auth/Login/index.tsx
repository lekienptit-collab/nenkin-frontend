import BrandMark from '@/components/BrandMark';
import { login } from '@/services/nenkin/auth';
import { getErrorCode } from '@/utils/error';
import { setToken } from '@/utils/token';
import {
  CheckCircleFilled,
  LockOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Alert, message } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';

const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  'Can not login': 'Sai tên đăng nhập hoặc mật khẩu!',
  USER_HAS_BANNED: 'Tài khoản đã bị khoá. Vui lòng liên hệ quản trị viên.',
};

/** Diem manh cua he thong, hien o panel thuong hieu ben trai. */
const HIGHLIGHTS = [
  'Quản lý hồ sơ người lao động và người đại diện tập trung',
  'Tự động sinh bộ giấy tờ Nenkin lần 1 và lần 2 dạng PDF',
  'Đọc thông tin từ ảnh giấy tờ bằng AI, giảm thời gian nhập liệu',
  'Phân quyền chi tiết tới từng chức năng cho mỗi nhân viên',
];

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
    <div className={styles.page}>
      {/* Panel thuong hieu - an tren man hinh hep de nhuong cho o dang nhap. */}
      <aside className={styles.brandSide}>
        <span className={`${styles.blob} ${styles.blobOne}`} />
        <span className={`${styles.blob} ${styles.blobTwo}`} />

        <div className={styles.brandInner}>
          <div className={styles.brandLogo}>
            <BrandMark size={44} />
            <div>
              <div className={styles.brandName}>Nenkin</div>
              <div className={styles.brandTag}>Hệ thống quản trị hồ sơ</div>
            </div>
          </div>

          <h1 className={styles.brandTitle}>
            Hoàn tất thủ tục hoàn tiền bảo hiểm hưu trí Nhật Bản
            <span> nhanh và chính xác hơn.</span>
          </h1>

          <ul className={styles.highlights}>
            {HIGHLIGHTS.map((item) => (
              <li key={item}>
                <CheckCircleFilled />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className={styles.brandFooter}>
            <SafetyCertificateOutlined /> Dữ liệu hồ sơ được bảo vệ theo phân quyền nội bộ
          </div>
        </div>
      </aside>

      {/* Khu vuc nhap tai khoan. */}
      <main className={styles.formSide}>
        <div className={styles.card}>
          <LoginForm
            logo={<BrandMark size={44} />}
            title="Đăng nhập"
            subTitle="Chào mừng bạn quay lại hệ thống Nenkin"
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

        <div className={styles.copyright}>
          © {new Date().getFullYear()} Nenkin · Hệ thống quản trị nội bộ
        </div>
      </main>
    </div>
  );
};

export default Login;
