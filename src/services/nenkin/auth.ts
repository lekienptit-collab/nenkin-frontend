import { request } from '@umijs/max';

/** Dang nhap POST /auth/login */
export async function login(body: API.LoginParams, options?: Record<string, any>) {
  return request<TOKEN.Auth>('/auth/login', {
    method: 'POST',
    data: body,
    ...(options || { skipErrorHandler: true }),
  });
}

/** Lam moi token POST /token/refresh */
export async function refreshToken(
  body: API.RefreshTokenParams,
  options?: Record<string, any>,
) {
  return request<TOKEN.Auth>('/token/refresh', {
    method: 'POST',
    data: body,
    ...(options || { skipErrorHandler: true }),
  });
}

/** Dang xuat DELETE /token */
export async function outLogin(data: API.LogoutParams, options?: Record<string, any>) {
  return request<Record<string, any>>('/token', {
    method: 'DELETE',
    data,
    ...(options || {}),
  });
}
