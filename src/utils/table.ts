/**
 * Dong tong so ban ghi o goc phai phan trang.
 * Mac dinh antd dich la "... mat hang" nen viet lai cho dung ngu canh.
 */
export const showTotal =
  (unit = 'bản ghi') =>
  (total: number, range: [number, number]) =>
    `${range[0]}-${range[1]} trên tổng ${total} ${unit}`;
