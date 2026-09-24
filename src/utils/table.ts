import { t, tv } from '@/utils/t';
/**
 * Dong tong so ban ghi o goc phai phan trang.
 * Mac dinh antd dich la "... mat hang" nen viet lai cho dung ngu canh.
 */
export const showTotal =
  (unit = t('bản ghi')) =>
  (total: number, range: [number, number]) =>
    tv('{from}-{to} trên tổng {total} {unit}', {
      from: range[0],
      to: range[1],
      total,
      unit,
    });
