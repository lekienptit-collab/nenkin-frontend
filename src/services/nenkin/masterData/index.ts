import { request } from '@umijs/max';

let cache: API.MasterData | undefined;

/**
 * Du lieu tham chieu (tinh thanh, ngan hang...) GET /master-data.
 * Du lieu co dinh nen chi goi 1 lan roi dung lai trong suot phien.
 */
export async function masterData(options?: Record<string, any>) {
  if (cache) {
    return cache;
  }
  cache = await request<API.MasterData>('/master-data', {
    method: 'GET',
    ...(options || {}),
  });
  return cache;
}

/** Xoa cache master data (dung khi dang xuat). */
export const clearMasterDataCache = () => {
  cache = undefined;
};

/** Tra dia chi Nhat Ban theo ma buu dien GET /master-data/jp-address */
export async function lookupJpAddress(postalCode: string, options?: Record<string, any>) {
  return request<API.JpPostalAddressList>('/master-data/jp-address', {
    method: 'GET',
    params: { postalCode },
    ...(options || {}),
  });
}

/** Tai anh giay to POST /uploads/image */
export async function uploadImage(file: File, options?: Record<string, any>) {
  const data = new FormData();
  data.append('file', file);
  return request<API.UploadResult>('/uploads/image', {
    method: 'POST',
    data,
    // De browser tu dat boundary cho multipart.
    headers: { 'Content-Type': undefined },
    ...(options || {}),
  });
}

/** Ghep URL tuong doi tu backend thanh URL day du de hien anh. */
export const mediaUrl = (url?: string) => {
  if (!url) return undefined;
  if (/^https?:\/\//.test(url)) return url;
  return `${API_URL}${url}`;
};
