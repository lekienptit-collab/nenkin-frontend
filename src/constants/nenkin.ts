/**
 * Hang so dung chung cho man hinh Nguoi lao dong / Nguoi dai dien / Thu tuc Nenkin.
 * Gia tri so khop voi enum o backend (src/common/constatns/master-data.ts).
 */

export const GENDER = {
  MALE: 0,
  FEMALE: 1,
} as const;

export const GENDER_LABELS: Record<number, string> = {
  [GENDER.MALE]: 'Nam',
  [GENDER.FEMALE]: 'Nữ',
};

export const PAPER_STATUS = {
  NOT_CREATED: 1,
  INCOMPLETE: 2,
  COMPLETE: 3,
} as const;

/** Nhan hien tren the trang thai o tung dong. */
export const PAPER_STATUS_LABELS: Record<number, string> = {
  [PAPER_STATUS.NOT_CREATED]: 'Chưa làm',
  [PAPER_STATUS.INCOMPLETE]: 'Chưa đủ hoặc thiếu thông tin',
  [PAPER_STATUS.COMPLETE]: 'Đủ giấy tờ',
};

/** Nhan trong o chon cua bo loc (trang goc dung chu khac voi the o dong). */
export const PAPER_STATUS_FILTER_LABELS: Record<number, string> = {
  [PAPER_STATUS.NOT_CREATED]: 'Chưa làm',
  [PAPER_STATUS.INCOMPLETE]: 'Thiếu hoặc chưa đủ thông tin',
  [PAPER_STATUS.COMPLETE]: 'Đầy đủ',
};

/**
 * Cac nut "Tim nhanh" tren danh sach nguoi lao dong.
 * `params` duoc gui thang len API, tuong ung voi cac link loc nhanh cua trang goc.
 */
export const WORKER_QUICK_FILTERS: {
  key: string;
  label: string;
  params: Record<string, any>;
}[] = [
  { key: 'full', label: 'Đủ thông tin', params: { hasLackingInfo: false } },
  { key: 'lacking', label: 'Thiếu thông tin', params: { hasLackingInfo: true } },
  { key: 'paper1', label: 'Chưa làm hồ sơ', params: { paperStatus: PAPER_STATUS.NOT_CREATED } },
  { key: 'paper2', label: 'Hồ sơ thiếu', params: { paperStatus: PAPER_STATUS.INCOMPLETE } },
  { key: 'paper3', label: 'Hồ sơ đủ', params: { paperStatus: PAPER_STATUS.COMPLETE } },
  { key: 'r1', label: 'Đã trả kết quả lần một', params: { nenkinFirstResult: 1 } },
  { key: 'r2', label: 'Đã trả kết quả lần hai', params: { nenkinSecondResult: 1 } },
];

export const NENKIN_RESULT = {
  NOT_YET: 0,
  RETURNED: 1,
} as const;

export const NENKIN_RESULT_LABELS: Record<number, string> = {
  [NENKIN_RESULT.NOT_YET]: 'Chưa trả kết quả',
  [NENKIN_RESULT.RETURNED]: 'Đã trả kết quả',
};

export const SERVICE_TYPE = {
  FIRST: 1,
  SECOND: 2,
} as const;

export const SERVICE_TYPE_LABELS: Record<number, string> = {
  [SERVICE_TYPE.FIRST]: 'Thủ tục Nenkin lần 1',
  [SERVICE_TYPE.SECOND]: 'Thủ tục Nenkin lần 2',
};

export const BANK_COUNTRY = {
  JAPAN: '81',
  VIETNAM: '84',
} as const;

export const BANK_COUNTRY_OPTIONS = [
  { value: BANK_COUNTRY.JAPAN, label: 'Japan' },
  { value: BANK_COUNTRY.VIETNAM, label: 'Việt Nam' },
];

/** Gia tri dac biet cho o select: nguoi dung tu nhap tay. */
export const OPTION_OTHERS = 'others';

/** So dong toi da cua bang "Qua trinh tham gia che do luong huu chung". */
export const MAX_INSURANCE_HISTORY = 4;

/** Id cac khoi tren form nguoi lao dong, dung cho menu dieu huong ben phai. */
export const WORKER_SECTIONS = [
  { key: 'personal', title: 'Thông tin cá nhân - hộ chiếu' },
  { key: 'address', title: 'Thông tin địa chỉ' },
  { key: 'residence', title: 'Thông tin thẻ ngoại kiều' },
  { key: 'nenkinBook', title: 'Thông tin sổ Nenkin' },
  { key: 'bank', title: 'Thông tin tài khoản Ngân hàng' },
  { key: 'tax', title: 'Thông tin thuế' },
  { key: 'insurance', title: 'Quá trình tham gia chế độ lương hưu chung' },
  { key: 'result', title: 'Thông tin kết quả Nenkin' },
] as const;

export const JP_POSTAL_CODE_PATTERN = /^\d{3}-\d{4}$/;
export const PENSION_NUMBER_PATTERN = /^\d{4}-\d{6}$/;

/**
 * Anh giay to nao doc duoc bang AI, va anh do nam o truong nao cua form.
 * Dung cho panel "Doc thong tin tu anh giay to".
 */
export const OCR_DOCUMENT_SOURCES: {
  type: API.WorkerDocumentType;
  field: keyof API.WorkerForm;
  label: string;
}[] = [
  { type: 'PASSPORT_FIRST', field: 'passportFirstPage', label: 'Hộ chiếu trang đầu' },
  { type: 'PASSPORT_STAMP', field: 'passportStampPage', label: 'Hộ chiếu trang có dấu xuất cảnh' },
  { type: 'RESIDENCE_CARD_FRONT', field: 'residenceCardFrontImage', label: 'Thẻ ngoại kiều mặt trước' },
  { type: 'RESIDENCE_CARD_BACK', field: 'residenceCardBackImage', label: 'Thẻ ngoại kiều mặt sau' },
  { type: 'NENKIN_BOOK', field: 'nenkinBookImage', label: 'Sổ Nenkin' },
  { type: 'BANK', field: 'bankImage', label: 'Giấy xác nhận tài khoản ngân hàng' },
];

/** Nhan tieng Viet cua cac truong AI co the doc ra. */
export const OCR_FIELD_LABELS: Record<string, string> = {
  name: 'Họ và tên',
  nameFurigana: 'Họ và tên (Katakana)',
  gender: 'Giới tính',
  dateOfBirth: 'Ngày tháng năm sinh',
  country: 'Quốc tịch',
  leaveJapanDate: 'Ngày rời Nhật Bản',
  occupation: 'Nghề nghiệp ở Nhật Bản',
  addressJpPrefectureCode: 'Tỉnh/Thành phố (địa chỉ ở Nhật)',
  addressJpDistrict: 'Xã/Phường/Thị trấn (địa chỉ ở Nhật)',
  addressJpHouseNumber: 'Đường phố/Số nhà (địa chỉ ở Nhật)',
  pensionNumber: 'Mã số lương hưu cơ sở',
  bankCountry: 'Quốc gia của ngân hàng',
  bankName: 'Tên ngân hàng',
  bankBranchName: 'Tên chi nhánh',
  bankSwiftCode: 'Mã Swift (BIC)',
  bankBranchAddress: 'Địa chỉ chi nhánh',
  bankAccountName: 'Tên tài khoản',
  bankAccountNumber: 'Số tài khoản',
};

/** Ly do khong doc duoc mot anh. */
export const OCR_ERROR_LABELS: Record<string, string> = {
  OCR_RATE_LIMITED: 'Vượt giới hạn số lần gọi AI, thử lại sau ít phút',
  OCR_IMAGE_NOT_FOUND: 'Không tìm thấy file ảnh trên máy chủ',
  OCR_IMAGE_NOT_SUPPORTED: 'Định dạng file không đọc được (chỉ đọc được ảnh)',
  OCR_EMPTY_RESULT: 'AI không đọc được nội dung nào từ ảnh',
  OCR_PROVIDER_ERROR: 'Dịch vụ AI đang lỗi, thử lại sau',
  OCR_NOT_CONFIGURED: 'Chưa cấu hình dịch vụ AI trên máy chủ',
};
