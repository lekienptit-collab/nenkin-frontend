import jaDict from '@/locales/ja-JP/dict';
import { getLocale } from '@umijs/max';

/** Umi lưu ngôn ngữ đang chọn ở đây. */
const LOCALE_KEY = 'umi_locale';

/**
 * Ngôn ngữ đang dùng. Đọc trực tiếp localStorage làm phương án dự phòng, vì
 * một số hằng số được tính ngay khi nạp module — lúc đó plugin locale của umi
 * có thể chưa sẵn sàng.
 */
const currentLocale = (): string => {
  try {
    const fromUmi = getLocale();
    if (fromUmi) return fromUmi;
  } catch {
    // umi chưa khởi tạo xong
  }
  try {
    return localStorage.getItem(LOCALE_KEY) || 'vi-VN';
  } catch {
    return 'vi-VN';
  }
};

/**
 * Dịch một câu sang ngôn ngữ đang chọn.
 *
 * Khoá tra cứu chính là câu tiếng Việt, không phải mã như `worker.name`. Cách
 * này giúp thêm chữ mới không cần đặt tên khoá, và nếu quên dịch câu nào thì
 * giao diện vẫn hiện tiếng Việt chứ không hiện mã lạ.
 */
export const t = (vi?: string): string => {
  if (!vi) return vi ?? '';
  if (currentLocale() !== 'ja-JP') return vi;
  return jaDict[vi] ?? vi;
};

/**
 * Dịch nhãn của danh sách lựa chọn. Nhiều danh sách do backend trả về bằng
 * tiếng Việt nên phải dịch lúc hiển thị.
 */
export const tOptions = <T extends { label?: string }>(options?: T[]): T[] =>
  (options || []).map((o) => (o.label ? { ...o, label: t(o.label) } : o));

/**
 * Dịch câu có chỗ trống. Chỗ trống viết dạng `{ten}` trong câu gốc:
 *
 *   tv('Bạn chắc chắn muốn xoá "{name}"?', { name: 'A' })
 */
export const tv = (vi: string, vars: Record<string, string | number>): string =>
  t(vi).replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''));
