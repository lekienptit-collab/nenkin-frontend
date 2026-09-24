import { t } from '@/utils/t';
import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { getToken, logoutToken } from './utils/token';

const loginPath = '/auth/login';

export const errorConfig: RequestConfig = {
  errorConfig: {
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      const { response } = error;

      if (!response) {
        notification.error({
          message: t('Lỗi kết nối'),
          description: t('Không kết nối được tới máy chủ. Vui lòng thử lại.'),
        });
        throw error;
      }

      // Token hết hạn hoặc bị thu hồi -> về trang đăng nhập.
      if (response.status === 401) {
        logoutToken();
        if (!history.location.pathname.startsWith('/auth/')) {
          history.push(loginPath);
        }
        throw error;
      }

      if (response.status === 403) {
        notification.error({
          message: t('Không có quyền'),
          description: t('Bạn không có quyền thực hiện thao tác này.'),
        });
        throw error;
      }

      throw error;
    },
  },

  requestInterceptors: [
    (config: RequestOptions) => {
      const token = getToken()?.accessToken;
      const headers: Record<string, any> = {
        'Content-Type': 'application/json',
        ...config.headers,
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      return { ...config, headers };
    },
  ],

  responseInterceptors: [(response) => response],
};
