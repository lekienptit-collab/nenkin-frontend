import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

/** Dinh dang ngay hien thi tren form. */
export const DISPLAY_DATE_FORMAT = 'DD/MM/YYYY';
/** Dinh dang ngay backend nhan. */
export const API_DATE_FORMAT = 'YYYY-MM-DD';

/**
 * Doi mot gia tri ngay bat ky ve chuoi YYYY-MM-DD de gui len backend.
 *
 * O chon ngay tra ve dayjs khi nguoi dung bam lich, nhung tra ve chuoi theo
 * dinh dang hien thi (DD/MM/YYYY) khi nguoi dung go tay, nen phai xu ly ca hai.
 */
export const toApiDate = (value: unknown): string | undefined => {
  if (!value) {
    return undefined;
  }
  if (dayjs.isDayjs(value)) {
    return value.format(API_DATE_FORMAT);
  }
  if (typeof value !== 'string') {
    return undefined;
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }

  const parsed = dayjs(value, DISPLAY_DATE_FORMAT, true);
  return parsed.isValid() ? parsed.format(API_DATE_FORMAT) : undefined;
};

/** Ap dung toApiDate cho cac truong ngay cua mot object. */
export const toApiDates = <T extends Record<string, any>>(
  values: T,
  fields: (keyof T)[],
): T => {
  const result = { ...values };
  fields.forEach((field) => {
    if (field in result) {
      result[field] = toApiDate(result[field]) as T[keyof T];
    }
  });
  return result;
};
