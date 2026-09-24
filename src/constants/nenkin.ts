import { t } from '@/utils/t';


/**
 * Hang so dung chung cho man hinh Nguoi lao dong / Nguoi dai dien / Thu tuc Nenkin.
 * Gia tri so khop voi enum o backend (src/common/constatns/master-data.ts).
 */

export const GENDER = {
  MALE: 0,
  FEMALE: 1,
} as const;

export const GENDER_LABELS: Record<number, string> = {
  [GENDER.MALE]: t('Nam'),
  [GENDER.FEMALE]: t('Nữ'),
};

export const PAPER_STATUS = {
  NOT_CREATED: 1,
  INCOMPLETE: 2,
  COMPLETE: 3,
} as const;

/** Nhan hien tren the trang thai o tung dong. */
export const PAPER_STATUS_LABELS: Record<number, string> = {
  [PAPER_STATUS.NOT_CREATED]: t('Chưa làm'),
  [PAPER_STATUS.INCOMPLETE]: t('Chưa đủ hoặc thiếu thông tin'),
  [PAPER_STATUS.COMPLETE]: t('Đủ giấy tờ'),
};

/** Nhan trong o chon cua bo loc (trang goc dung chu khac voi the o dong). */
export const PAPER_STATUS_FILTER_LABELS: Record<number, string> = {
  [PAPER_STATUS.NOT_CREATED]: t('Chưa làm'),
  [PAPER_STATUS.INCOMPLETE]: t('Thiếu hoặc chưa đủ thông tin'),
  [PAPER_STATUS.COMPLETE]: t('Đầy đủ'),
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
  { key: 'full', label: t('Đủ thông tin'), params: { hasLackingInfo: false } },
  { key: 'lacking', label: t('Thiếu thông tin'), params: { hasLackingInfo: true } },
  { key: 'paper1', label: t('Chưa làm hồ sơ'), params: { paperStatus: PAPER_STATUS.NOT_CREATED } },
  { key: 'paper2', label: t('Hồ sơ thiếu'), params: { paperStatus: PAPER_STATUS.INCOMPLETE } },
  { key: 'paper3', label: t('Hồ sơ đủ'), params: { paperStatus: PAPER_STATUS.COMPLETE } },
  { key: 'r1', label: t('Đã trả kết quả lần một'), params: { nenkinFirstResult: 1 } },
  { key: 'r2', label: t('Đã trả kết quả lần hai'), params: { nenkinSecondResult: 1 } },
];

export const NENKIN_RESULT = {
  NOT_YET: 0,
  RETURNED: 1,
} as const;

export const NENKIN_RESULT_LABELS: Record<number, string> = {
  [NENKIN_RESULT.NOT_YET]: t('Chưa trả kết quả'),
  [NENKIN_RESULT.RETURNED]: t('Đã trả kết quả'),
};

export const SERVICE_TYPE = {
  FIRST: 1,
  SECOND: 2,
} as const;

export const SERVICE_TYPE_LABELS: Record<number, string> = {
  [SERVICE_TYPE.FIRST]: t('Thủ tục Nenkin lần 1'),
  [SERVICE_TYPE.SECOND]: t('Thủ tục Nenkin lần 2'),
};

/** Truong hop cua nguoi lao dong khi lam thu tuc. */
export const CASE_TYPE = {
  RETURN_HOME: 1,
  RETURN_JAPAN: 2,
} as const;

export const CASE_TYPE_OPTIONS = [
  { value: CASE_TYPE.RETURN_HOME, label: t('Về nước hẳn') },
  { value: CASE_TYPE.RETURN_JAPAN, label: t('Quay lại Nhật') },
];

export const CASE_TYPE_LABELS: Record<number, string> = {
  [CASE_TYPE.RETURN_HOME]: t('Về nước hẳn'),
  [CASE_TYPE.RETURN_JAPAN]: t('Quay lại Nhật'),
};

/** Che do luong huu da tham gia, in o cot (4) muc 7 cua 請求書. */
export const PENSION_SCHEME_OPTIONS = [
  { value: 1, label: t('国民年金 — Bảo hiểm quốc dân') },
  { value: 2, label: t('厚生年金保険 — Bảo hiểm lao động xã hội') },
  { value: 3, label: t('船員保険 — Bảo hiểm hàng hải') },
  { value: 4, label: t('共済組合 — Hiệp hội hỗ tương') },
];

/** Lao dong lam cong ty chiem da so nen mac dinh 厚生年金保険. */
export const DEFAULT_PENSION_SCHEME = 2;

/** Mức miễn đánh thuế cố định của Sở Thuế, người dùng không sửa. */
export const TAX_DEDUCT_FIXED = 1200000;

export const BANK_COUNTRY = {
  JAPAN: '81',
  VIETNAM: '84',
} as const;

export const BANK_COUNTRY_OPTIONS = [
  { value: BANK_COUNTRY.JAPAN, label: t('Nhật Bản') },
  { value: BANK_COUNTRY.VIETNAM, label: t('Việt Nam') },
];

/** Gia tri dac biet cho o select: nguoi dung tu nhap tay. */
export const OPTION_OTHERS = 'others';

/** So dong toi da cua bang "Qua trinh tham gia che do luong huu chung". */
export const MAX_INSURANCE_HISTORY = 4;

/** Id cac khoi tren form nguoi lao dong, dung cho menu dieu huong ben phai. */
export const WORKER_SECTIONS = [
  { key: 'personal', title: t('Thông tin cá nhân - hộ chiếu') },
  { key: 'address', title: t('Thông tin địa chỉ') },
  { key: 'residence', title: t('Thông tin thẻ ngoại kiều') },
  { key: 'nenkinBook', title: t('Thông tin sổ Nenkin') },
  { key: 'bank', title: t('Thông tin tài khoản Ngân hàng') },
  { key: 'tax', title: t('Thông tin thuế') },
  { key: 'insurance', title: t('Quá trình tham gia chế độ lương hưu chung') },
  { key: 'result', title: t('Thông tin kết quả Nenkin') },
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
  { type: 'PASSPORT_FIRST', field: 'passportFirstPage', label: t('Hộ chiếu trang đầu') },
  { type: 'PASSPORT_STAMP', field: 'passportStampPage', label: t('Hộ chiếu trang có dấu xuất cảnh') },
  { type: 'RESIDENCE_CARD_FRONT', field: 'residenceCardFrontImage', label: t('Thẻ ngoại kiều mặt trước') },
  { type: 'RESIDENCE_CARD_BACK', field: 'residenceCardBackImage', label: t('Thẻ ngoại kiều mặt sau') },
  { type: 'NENKIN_BOOK', field: 'nenkinBookImage', label: t('Sổ Nenkin') },
  { type: 'BANK', field: 'bankImage', label: t('Giấy xác nhận tài khoản ngân hàng') },
];

/** Nhan cho cac o anh khong doc bang AI (chi luu tru va ghep vao ho so). */
export const EXTRA_DOCUMENT_LABELS: Record<string, string> = {
  insuranceLossImage: t('Giấy xác nhận cắt bảo hiểm Nenkin (資格喪失証明書)'),
};

/** Nhan tieng Viet cua cac truong AI co the doc ra. */
export const OCR_FIELD_LABELS: Record<string, string> = {
  name: t('Họ và tên'),
  nameFurigana: t('Họ và tên (Katakana)'),
  gender: t('Giới tính'),
  dateOfBirth: t('Ngày tháng năm sinh'),
  country: t('Quốc tịch'),
  leaveJapanDate: t('Ngày rời Nhật Bản'),
  occupation: t('Nghề nghiệp ở Nhật Bản'),
  addressJpPrefectureCode: t('Tỉnh/Thành phố (địa chỉ ở Nhật)'),
  addressJpDistrict: t('Xã/Phường/Thị trấn (địa chỉ ở Nhật)'),
  addressJpHouseNumber: t('Đường phố/Số nhà (địa chỉ ở Nhật)'),
  pensionNumber: t('Mã số lương hưu cơ sở'),
  bankCountry: t('Quốc gia của ngân hàng'),
  bankName: t('Tên ngân hàng'),
  bankBranchName: t('Tên chi nhánh'),
  bankSwiftCode: t('Mã Swift (BIC)'),
  bankBranchAddress: t('Địa chỉ chi nhánh'),
  bankAccountName: t('Tên tài khoản'),
  bankAccountNumber: t('Số tài khoản'),
};

/** Ly do khong doc duoc mot anh. */
export const OCR_ERROR_LABELS: Record<string, string> = {
  OCR_RATE_LIMITED: t('Vượt giới hạn số lần gọi AI, thử lại sau ít phút'),
  OCR_IMAGE_NOT_FOUND: t('Không tìm thấy file ảnh trên máy chủ'),
  OCR_IMAGE_NOT_SUPPORTED: t('Định dạng file không đọc được (chỉ đọc được ảnh)'),
  OCR_EMPTY_RESULT: t('AI không đọc được nội dung nào từ ảnh'),
  OCR_PROVIDER_ERROR: t('Dịch vụ AI đang lỗi, thử lại sau'),
  OCR_NOT_CONFIGURED: t('Chưa cấu hình dịch vụ AI trên máy chủ'),
};
