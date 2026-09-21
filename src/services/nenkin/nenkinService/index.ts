import { request } from '@umijs/max';

/** Ho so Nenkin da lam GET /nenkin/procedures */
export async function nenkinProcedures(
  params: { workerId?: number; serviceType?: API.NenkinServiceType },
  options?: Record<string, any>,
) {
  return request<API.NenkinProcedureList>('/nenkin/procedures', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** Chi tiet ho so GET /nenkin/procedures/:id */
export async function getNenkinProcedure(id: number, options?: Record<string, any>) {
  return request<API.NenkinProcedureItem>(`/nenkin/procedures/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** Tao / cap nhat ho so Nenkin POST /nenkin/procedures */
export async function saveNenkinProcedure(
  data: API.NenkinProcedureForm,
  options?: Record<string, any>,
) {
  return request<API.NenkinProcedureItem>('/nenkin/procedures', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** Xoa ho so Nenkin DELETE /nenkin/procedures/:id */
export async function removeNenkinProcedure(id: number, options?: Record<string, any>) {
  return request<API.ResSuccess>(`/nenkin/procedures/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** Danh sach giay to cua tung lan thu tuc GET /nenkin/paper-templates */
export async function nenkinPaperTemplates(options?: Record<string, any>) {
  return request<API.NenkinPaperTemplates>('/nenkin/paper-templates', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * Tai noi dung PDF ve dang blob.
 *
 * Khong dung the <a href> tro thang vao API duoc: token nam trong localStorage
 * nen trinh duyet khong tu gan header Authorization, server se tra ve 401.
 */
const fetchPdf = async (path: string) =>
  request<Blob>(path, { method: 'GET', responseType: 'blob' });

const saveBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

/** Tai file PDF cua mot giay to ve may. */
export async function downloadNenkinDocument(id: number, fileName: string) {
  const blob = await fetchPdf(`/nenkin/documents/${id}/download`);
  saveBlob(blob, fileName);
}

/** Tai file PDF gop ca bo ho so ve may. */
export async function downloadNenkinProcedure(id: number, fileName: string) {
  const blob = await fetchPdf(`/nenkin/procedures/${id}/download`);
  saveBlob(blob, fileName);
}

/**
 * Mo file PDF de xem truoc trong tab moi.
 *
 * Phai mo tab TRUOC khi goi API: mo sau khi await thi trinh duyet khong con coi
 * day la thao tac cua nguoi dung nua va se chan popup.
 */
export async function previewNenkinPdf(kind: 'documents' | 'procedures', id: number) {
  const tab = window.open('', '_blank');
  try {
    const blob = await fetchPdf(`/nenkin/${kind}/${id}/download`);
    const url = URL.createObjectURL(blob);
    if (tab) {
      tab.location.href = url;
    } else {
      window.location.href = url;
    }
    // Thu hoi sau khi tab kia da doc xong.
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch (error) {
    tab?.close();
    throw error;
  }
}

