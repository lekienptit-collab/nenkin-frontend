import { request } from '@umijs/max';

/** Danh sach nguoi dai dien GET /agents */
export async function agents(p: API.AgentQueryParams, options?: Record<string, any>) {
  const params: Record<string, any> = {
    page: p.current,
    limit: p.pageSize,
  };
  if (p?.keyword?.trim()) params.keyword = p.keyword.trim();

  return request<API.AgentList>('/agents', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** Chi tiet nguoi dai dien GET /agents/:id */
export async function getAgent(id: number, options?: Record<string, any>) {
  return request<API.AgentListItem>(`/agents/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** Tim nhanh nguoi dai dien GET /agents/search */
export async function searchAgents(keyword?: string, options?: Record<string, any>) {
  return request<API.AgentSearchList>('/agents/search', {
    method: 'GET',
    params: { keyword },
    ...(options || {}),
  });
}

/** Tao nguoi dai dien POST /agents */
export async function addAgent(data: API.AgentForm, options?: Record<string, any>) {
  return request<API.AgentListItem>('/agents', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** Cap nhat nguoi dai dien PATCH /agents/:id */
export async function updateAgent(
  id: number,
  data: API.AgentForm,
  options?: Record<string, any>,
) {
  return request<API.AgentListItem>(`/agents/${id}`, {
    method: 'PATCH',
    data,
    ...(options || {}),
  });
}

/** Xoa nhieu nguoi dai dien DELETE /agents */
export async function deleteAgents(ids: number[], options?: Record<string, any>) {
  return request<API.ResSuccess>('/agents', {
    method: 'DELETE',
    data: { ids },
    ...(options || {}),
  });
}
