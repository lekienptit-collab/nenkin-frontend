import { refreshToken } from '@/services/nenkin/auth';
import { getToken, setToken } from '@/utils/token';
import { SelectLang, useModel } from '@umijs/max';
import { Space } from 'antd';
import React, { useEffect } from 'react';
import Avatar from './AvatarDropdown';
import styles from './index.less';

/** Con 5 phut nua het han thi xin token moi. */
const REFRESH_BEFORE_MS = 5 * 60 * 1000;
const CHECK_INTERVAL_MS = 30 * 1000;

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  useEffect(() => {
    const timer = setInterval(async () => {
      const auth = getToken();
      if (!auth?.expiresAt || !auth?.refreshToken) return;

      // expiresAt la epoch giay (chuan JWT exp).
      const expiresAtMs = auth.expiresAt * 1000;
      if (expiresAtMs - Date.now() > REFRESH_BEFORE_MS) return;

      try {
        const data = await refreshToken({ refreshToken: auth.refreshToken });
        if (data?.accessToken && data?.refreshToken) {
          setToken(data);
        }
      } catch (e) {
        // Refresh token het han -> de request tiep theo tra 401 va dieu huong.
      }
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings as Record<string, any>;
  let className = styles.right;
  if ((navTheme === 'realDark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right} ${styles.dark}`;
  }

  return (
    <Space className={className}>
      <SelectLang globalIconClassName="select-lang" />
      <Avatar />
    </Space>
  );
};

export default GlobalHeaderRight;
