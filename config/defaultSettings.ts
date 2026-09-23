import type { ProLayoutProps, ProSettings } from '@ant-design/pro-components';
import { brand } from './theme';

export type LayoutSettings = ProSettings & {
  token?: ProLayoutProps['token'];
  pwa?: boolean;
  logo?: string;
  siderWidth?: number;
};

/**
 * Giao dien khung ngoai (header + sider) cua ProLayout.
 * Header nen sang, menu dang chon la vien bo tron mau thuong hieu.
 */
const Settings: LayoutSettings = {
  navTheme: 'light',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  title: 'Nenkin',
  logo: '/logo.svg',
  siderWidth: 248,
  pwa: false,
  iconfontUrl: '',
  token: {
    header: {
      colorBgHeader: 'rgba(255, 255, 255, 0.88)',
      colorHeaderTitle: brand.ink,
      colorTextMenu: '#55637d',
      colorTextMenuSecondary: brand.textSecondary,
      colorTextMenuSelected: brand.primaryHover,
      colorTextMenuActive: brand.primary,
      colorBgMenuItemSelected: 'rgba(37, 99, 235, 0.10)',
      colorBgMenuItemHover: 'rgba(37, 99, 235, 0.06)',
      colorTextRightActionsItem: '#55637d',
      heightLayoutHeader: 56,
    },
    sider: {
      colorMenuBackground: '#ffffff',
      colorMenuItemDivider: brand.border,
      colorTextMenu: '#55637d',
      colorTextMenuSecondary: brand.textSecondary,
      colorTextMenuTitle: brand.ink,
      colorTextMenuSelected: brand.primaryHover,
      colorTextMenuActive: brand.primary,
      colorTextMenuItemHover: brand.primary,
      colorBgMenuItemSelected: 'rgba(37, 99, 235, 0.10)',
      colorBgMenuItemHover: 'rgba(37, 99, 235, 0.06)',
      colorBgMenuItemCollapsedElevated: '#ffffff',
      colorBgCollapsedButton: '#ffffff',
      colorTextCollapsedButton: brand.textSecondary,
      colorTextCollapsedButtonHover: brand.primary,
      paddingInlineLayoutMenu: 8,
      paddingBlockLayoutMenu: 8,
    },
    pageContainer: {
      colorBgPageContainer: 'transparent',
      colorBgPageContainerFixed: 'rgba(255, 255, 255, 0.88)',
      paddingBlockPageContainerContent: 20,
      paddingInlinePageContainerContent: 24,
    },
    // Nen hoi chuyen sac o dinh trang cho do "phang".
    bgLayout: `linear-gradient(180deg, #eef3ff 0%, ${brand.bgLayout} 280px)`,
  },
};

export default Settings;
