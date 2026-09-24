import { t } from '@/utils/t';
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
import { SelectLang, useModel } from '@umijs/max';
import { Alert, message } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';

const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  'Can not login': t('Sai tên đăng nhập hoặc mật khẩu!'),
  USER_HAS_BANNED: t('Tài khoản đã bị khoá. Vui lòng liên hệ quản trị viên.'),
};

/** Diem manh cua he thong, hien o panel thuong hieu ben trai. */
const HIGHLIGHTS = [
  t('Quản lý hồ sơ người lao động và người đại diện tập trung'),
  t('Tự động sinh bộ giấy tờ Nenkin lần 1 và lần 2 dạng PDF'),
  t('Đọc thông tin từ ảnh giấy tờ bằng AI, giảm thời gian nhập liệu'),
  t('Phân quyền chi tiết tới từng chức năng cho mỗi nhân viên'),
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
      message.success(t('Đăng nhập thành công!'));

      const urlParams = new URL(window.location.href).searchParams;
      window.location.href = urlParams.get('redirect') || '/';
    } catch (error: any) {
      const code = getErrorCode(error);
      setErrorMessage(LOGIN_ERROR_MESSAGES[code] || t('Sai tên đăng nhập hoặc mật khẩu!'));
    }
  };

  return (
    <div className={styles.page}>
      {/* Nut doi ngon ngu de ngay tren man hinh dang nhap, giong trang cu. */}
      <div className={styles.langSwitch}>
        <SelectLang globalIconClassName="select-lang" />
      </div>
      {/* Panel thuong hieu - an tren man hinh hep de nhuong cho o dang nhap. */}
      <aside className={styles.brandSide}>
        <span className={`${styles.blob} ${styles.blobOne}`} />
        <span className={`${styles.blob} ${styles.blobTwo}`} />

        <div className={styles.brandInner}>
          <div className={styles.brandLogo}>
            <BrandMark size={44} />
            <div>
              <div className={styles.brandName}>Nenkin</div>
              <div className={styles.brandTag}>{t('Hệ thống quản trị hồ sơ')}</div>
            </div>
          </div>

          <h1 className={styles.brandTitle}>
            {t('Hoàn tất thủ tục hoàn tiền bảo hiểm hưu trí Nhật Bản')}
            <span>{t('nhanh và chính xác hơn.')}</span>
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
            <SafetyCertificateOutlined />{' '}
            {t('Dữ liệu hồ sơ được bảo vệ theo phân quyền nội bộ')}
          </div>
        </div>
      </aside>

      {/* Khu vuc nhap tai khoan. */}
      <main className={styles.formSide}>
        <div className={styles.card}>
          <LoginForm
            logo={<BrandMark size={44} />}
            title={t('Đăng nhập')}
            subTitle={t('Chào mừng bạn quay lại hệ thống Nenkin')}
            initialValues={{ autoLogin: false }}
            onFinish={async (values) => {
              await handleSubmit(values as API.LoginParams);
            }}
            submitter={{ searchConfig: { submitText: t('Đăng nhập') } }}
          >
            {errorMessage && <LoginMessage content={errorMessage} />}

            <ProFormText
              name="username"
              fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
              placeholder={t('Tên đăng nhập hoặc email')}
              rules={[{ required: true, message: t('Bạn cần nhập username hoặc email!') }]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
              placeholder={t('Mật khẩu')}
              rules={[{ required: true, message: t('Bạn cần nhập mật khẩu!') }]}
            />
          </LoginForm>
        </div>

        <div className={styles.copyright}>
          © {new Date().getFullYear()} {t('Nenkin · Hệ thống quản trị nội bộ')}
        </div>
      </main>
    </div>
  );
};

export default Login;
