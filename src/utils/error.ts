/**
 * Backend tra loi dang { msg, data }. Ham nay lay ra ma loi de dich sang tieng Viet.
 */
export const getErrorCode = (error: any): string | undefined => {
  return error?.response?.data?.msg || error?.data?.msg;
};

export const getErrorData = (error: any): any => {
  return error?.response?.data?.data || error?.data?.data;
};
