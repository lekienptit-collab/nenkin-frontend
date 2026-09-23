import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { currentUser as queryCurrentUser, queryPermission } from '@/services/nenkin/user';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import type { LayoutSettings } from '../config/defaultSettings';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { getToken } from './utils/token';

const loginPath = '/auth/login';
/** Cac route khong yeu cau dang nhap */
const publicPaths = [loginPath];

const isPublicPath = (path: string) => publicPaths.some((p) => path.startsWith(p));

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  fetchAllInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async (): Promise<API.CurrentUser | undefined> => {
    try {
      return await queryCurrentUser();
    } catch (error) {
      return undefined;
    }
  };

  const fetchPermission = async (): Promise<string[]> => {
    try {
      return await queryPermission();
    } catch (error) {
      return [];
    }
  };

  const fetchAllInfo = async (): Promise<API.CurrentUser | undefined> => {
    const [user, perms] = await Promise.all([fetchUserInfo(), fetchPermission()]);
    if (!user?.id) return undefined;
    return { ...user, permissions: perms };
  };

  const currentPath = history.location.pathname;

  // Chua co token thi khong goi API, day thang ve trang dang nhap.
  if (!getToken()?.accessToken) {
    if (!isPublicPath(currentPath)) {
      history.push(loginPath);
    }
    return { fetchUserInfo, fetchAllInfo, settings: defaultSettings };
  }

  const currentUser = await fetchAllInfo();
  if (!currentUser && !isPublicPath(currentPath)) {
    history.push(loginPath);
  }

  return { fetchUserInfo, fetchAllInfo, currentUser, settings: defaultSettings };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    footerRender: () => <Footer />,
    disableContentMargin: false,
    // Chu chim ten nguoi dang dung: giu de chong chup man hinh, nhung lam that
    // nhat de khong lam roi noi dung.
    waterMarkProps:
      APP_NAME !== 'false'
        ? {
            content: initialState?.currentUser?.username,
            fontColor: 'rgba(15, 28, 63, 0.045)',
            fontSize: 14,
            gapX: 160,
            gapY: 130,
          }
        : undefined,
    onPageChange: () => {
      const { pathname } = history.location;
      if (!initialState?.currentUser && !isPublicPath(pathname)) {
        history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};

export const request: RequestConfig = {
  baseURL: API_URL,
  ...errorConfig,
};
