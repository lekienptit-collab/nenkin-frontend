import { request } from '@umijs/max';

/** Danh sach role GET /roles */
export async function role(params: API.RoleQueryParams, options?: Record<string, any>) {
  const p: Record<string, any> = {
    page: params.current,
    limit: params.pageSize,
  };
  if (params?.name) p.name = params.name;
  if (params?.slug) p.slug = params.slug;
  if (params?.parent) p.parent = params.parent;

  return request<API.RoleList>('/roles', {
    method: 'GET',
    params: p,
    ...(options || {}),
  });
}

/** Lay tat ca role (dung cho select box) */
export async function getRoles(options?: Record<string, any>) {
  const res = await request<API.RoleList>('/roles', {
    method: 'GET',
    params: { page: 1, limit: 100 },
    ...(options || {}),
  });
  return res?.data || [];
}

/** Tim role theo slug GET /roles/search */
export async function searchRoles(slug: string[], options?: Record<string, any>) {
  return request<API.RoleListItem[]>('/roles/search', {
    method: 'GET',
    params: { slug },
    ...(options || {}),
  });
}

/** Tao role POST /roles */
export async function addRole(data: API.RoleCreateForm, options?: Record<string, any>) {
  return request<API.RoleListItem>('/roles', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** Cap nhat role PATCH /roles/:id */
export async function updateRole(
  id: number | undefined,
  data: API.RoleCreateForm,
  options?: Record<string, any>,
) {
  return request<API.RoleListItem>(`/roles/${id}`, {
    method: 'PATCH',
    data,
    ...(options || {}),
  });
}

/** Xoa role DELETE /roles/:id */
export async function removeRole(id: number, options?: Record<string, any>) {
  return request<API.ResSuccess>(`/roles/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** Danh sach permission theo nhom GET /roles/permissions */
export async function permissions(options?: Record<string, any>) {
  return request<API.PermissionGroup>('/roles/permissions', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Permission cua role + gioi han cua role cha GET /roles/permission-to-customer/:id */
export async function getRoleToCustomPermission(id: number, options?: Record<string, any>) {
  return request<API.RoleToCustomPermission>(`/roles/permission-to-customer/${Number(id)}`, {
    method: 'GET',
    ...(options || {}),
  });
}
