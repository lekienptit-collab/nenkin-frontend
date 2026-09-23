import { outLogin } from '@/services/nenkin/auth';
import { getToken, logoutToken } from '@/utils/token';
import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Avatar, Spin } from 'antd';
import type { MenuProps } from 'antd';
import React, { useCallback } from 'react';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const loginPath = '/auth/login';

const loginOut = async () => {
  const auth = getToken();
  try {
    if (auth?.accessToken) {
      await outLogin({ token: auth.accessToken });
    }
  } catch (e) {
    // Token co the da het han; van xoa o local roi ve trang dang nhap.
  }
  logoutToken();
  const { pathname, search } = history.location;
  if (pathname !== loginPath) {
    history.replace({
      pathname: loginPath,
      search: `?redirect=${encodeURIComponent(pathname + search)}`,
    });
  }
};

const AvatarDropdown: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick: MenuProps['onClick'] = useCallback(
    async (event: { key: string }) => {
      const { key } = event;
      if (key === 'logout') {
        await loginOut();
        setInitialState((s) => ({ ...s, currentUser: undefined }));
        return;
      }
      history.push(`/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;
  if (!currentUser?.username) {
    return loading;
  }

  const menuItems: MenuProps['items'] = [
    { key: 'profile', icon: <UserOutlined />, label: 'Thông tin cá nhân' },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất' },
  ];

  return (
    <HeaderDropdown menu={{ items: menuItems, onClick: onMenuClick }}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size={32}
          className={styles.avatar}
          src={currentUser.avatar}
          icon={!currentUser.avatar ? <UserOutlined /> : undefined}
          alt="avatar"
        />
        <span className={styles.name}>{currentUser.fullname || currentUser.username}</span>
        <DownOutlined className={styles.caret} />
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
