import type { ProLayoutProps, ProSettings } from '@ant-design/pro-components';

export type LayoutSettings = ProSettings & {
  token?: ProLayoutProps['token'];
  pwa?: boolean;
  logo?: string;
};

const Settings: LayoutSettings = {
  navTheme: 'light',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'Nenkin',
  pwa: false,
  iconfontUrl: '',
  token: {
    header: {
      colorBgHeader: '#0255da',
      colorHeaderTitle: '#fff',
      colorTextMenu: '#dfdfdf',
      colorTextMenuSecondary: '#dfdfdf',
      colorTextMenuSelected: '#fff',
      colorBgMenuItemSelected: '#22272b',
      colorTextRightActionsItem: '#dfdfdf',
    },
    sider: {
      colorTextMenuSelected: '#1890ff',
      colorBgMenuItemSelected: '#e6f7ff',
      colorTextMenuItemHover: '#1890ff',
      colorBgMenuItemHover: '#e6f7ff',
    },
    bgLayout: '#f0f2f5',
  },
};

export default Settings;
