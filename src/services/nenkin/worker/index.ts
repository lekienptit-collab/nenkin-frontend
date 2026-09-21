import { request } from '@umijs/max';

/** Danh sach nguoi lao dong GET /workers */
export async function workers(p: API.WorkerQueryParams, options?: Record<string, any>) {
  const params: Record<string, any> = {
    page: p.current,
    limit: p.pageSize,
  };
  if (p?.keyword?.trim()) params.keyword = p.keyword.trim();
  if (p?.createdById) params.createdById = p.createdById;
  if (p?.fromDate) params.fromDate = p.fromDate;
  if (p?.toDate) params.toDate = p.toDate;
  if (p?.firstPaperStatus) params.firstPaperStatus = p.firstPaperStatus;
  if (p?.secondPaperStatus) params.secondPaperStatus = p.secondPaperStatus;
  if (typeof p?.nenkinFirstResult === 'number')
    params.nenkinFirstResult = p.nenkinFirstResult;
  if (typeof p?.nenkinSecondResult === 'number')
    params.nenkinSecondResult = p.nenkinSecondResult;
  if (p?.paperStatus) params.paperStatus = p.paperStatus;
  if (typeof p?.hasLackingInfo === 'boolean')
    params.hasLackingInfo = p.hasLackingInfo;

  return request<API.WorkerList>('/workers', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** Chi tiet nguoi lao dong GET /workers/:id */
export async function getWorker(id: number, options?: Record<string, any>) {
  return request<API.WorkerListItem>(`/workers/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** Tim nhanh nguoi lao dong GET /workers/search */
export async function searchWorkers(keyword?: string, options?: Record<string, any>) {
  return request<API.WorkerSearchList>('/workers/search', {
    method: 'GET',
    params: { keyword },
    ...(options || {}),
  });
}

/** Tao nguoi lao dong POST /workers */
export async function addWorker(data: API.WorkerForm, options?: Record<string, any>) {
  return request<API.WorkerListItem>('/workers', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** Cap nhat nguoi lao dong PATCH /workers/:id */
export async function updateWorker(
  id: number,
  data: API.WorkerForm,
  options?: Record<string, any>,
) {
  return request<API.WorkerListItem>(`/workers/${id}`, {
    method: 'PATCH',
    data,
    ...(options || {}),
  });
}

/** Doi trang thai da tra ket qua Nenkin PATCH /workers/:id/nenkin-result */
export async function updateNenkinResult(
  id: number,
  data: API.UpdateNenkinResultForm,
  options?: Record<string, any>,
) {
  return request<API.WorkerListItem>(`/workers/${id}/nenkin-result`, {
    method: 'PATCH',
    data,
    ...(options || {}),
  });
}

/** Xoa nhieu nguoi lao dong DELETE /workers */
export async function deleteWorkers(ids: number[], options?: Record<string, any>) {
  return request<API.ResSuccess>('/workers', {
    method: 'DELETE',
    data: { ids },
    ...(options || {}),
  });
}
