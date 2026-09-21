declare namespace API {
  type WorkerDocumentType =
    | 'PASSPORT_FIRST'
    | 'PASSPORT_STAMP'
    | 'RESIDENCE_CARD_FRONT'
    | 'RESIDENCE_CARD_BACK'
    | 'NENKIN_BOOK'
    | 'BANK';

  type OcrStatus = {
    /** Backend da cau hinh GROQ_API_KEY hay chua. */
    enabled: boolean;
    documentTypes: { type: WorkerDocumentType; label: string }[];
  };

  type OcrDocumentInput = {
    type: WorkerDocumentType;
    url: string;
  };

  type OcrDocumentResult = {
    type: WorkerDocumentType;
    label: string;
    success: boolean;
    /** Cac truong da chuan hoa ve dung ten truong cua form nguoi lao dong. */
    fields: Partial<API.WorkerForm>;
    errorCode?: string;
  };

  type OcrExtractResult = {
    /** Goi y cuoi cung sau khi gop moi giay to. */
    fields: Partial<API.WorkerForm>;
    results: OcrDocumentResult[];
  };
}
