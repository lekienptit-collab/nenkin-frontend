import { request } from '@umijs/max';

/** Danh sach thanh vien GET /users */
export async function users(p: API.UserQueryParams, options?: Record<string, any>) {
  const params: Record<string, any> = {
    page: p.current,
    limit: p.pageSize,
  };
  if (p?.username?.trim()) params.username = p.username.trim();
  if (p?.email?.trim()) params.email = p.email.trim();
  if (p?.fullname?.trim()) params.fullname = p.fullname.trim();
  if (p?.phone?.trim()) params.phone = p.phone.trim();
  if (p?.roleId) params.roleId = p.roleId;
  if (typeof p?.isActive === 'boolean') params.isActive = p.isActive;

  return request<API.UserList>('/users', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** Tim nhanh user GET /users-search */
export async function searchUsers(
  keyword?: string,
  roleId?: number,
  excludeId?: string,
  options?: Record<string, any>,
) {
  return request<API.UserList>('/users-search', {
    method: 'GET',
    params: { keyword, roleId, excludeId },
    ...(options || {}),
  });
}

/** Tao thanh vien POST /users */
export async function addUser(data: API.UserCreateForm, options?: Record<string, any>) {
  return request<API.UserListItem>('/users', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** Cap nhat thanh vien PATCH /users/:id */
export async function updateUser(
  id: string | undefined,
  data: API.UserUpdateForm,
  options?: Record<string, any>,
) {
  return request<API.UserListItem>(`/users/${id}`, {
    method: 'PATCH',
    data,
    ...(options || {}),
  });
}

/** Khoa / mo khoa PATCH /users/ban/:id */
export async function banUnBanUser(
  id: string,
  isActive: boolean,
  options?: Record<string, any>,
) {
  return request<API.ResSuccess>(`/users/ban/${id}`, {
    method: 'PATCH',
    data: { isActive },
    ...(options || {}),
  });
}

/** Xoa nhieu thanh vien DELETE /users */
export async function deleteUsers(ids: string[], options?: Record<string, any>) {
  return request<API.ResSuccess>('/users', {
    method: 'DELETE',
    data: { ids },
    ...(options || {}),
  });
}

/** Tai khoan dang dang nhap GET /me */
export async function currentUser(options?: Record<string, any>) {
  return request<API.CurrentUser>('/me', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Permission cua tai khoan hien tai GET /me/permissions */
export async function queryPermission(options?: Record<string, any>) {
  return request<string[]>('/me/permissions', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Cap nhat ho so PATCH /me */
export async function updateMe(data: API.UserUpdateMeForm, options?: Record<string, any>) {
  return request<API.UserListItem>('/me', {
    method: 'PATCH',
    data,
    ...(options || {}),
  });
}

/** Doi mat khau PATCH /me/password */
export async function updatePasswordMe(
  data: API.UserUpdatePasswordForm,
  options?: Record<string, any>,
) {
  return request<API.ResSuccess>('/me/password', {
    method: 'PATCH',
    data,
    ...(options || {}),
  });
}
