declare namespace API {
  /** 0 = Nam, 1 = Nu */
  type Gender = 0 | 1;

  /** 1 = Chua lam, 2 = Thieu thong tin, 3 = Day du */
  type PaperStatus = 1 | 2 | 3;

  /** 0 = Chua tra ket qua, 1 = Da tra ket qua */
  type NenkinResult = 0 | 1;

  /** 1 = thu tuc lan 1, 2 = thu tuc lan 2 */
  type NenkinServiceType = 1 | 2;

  type MissingField = {
    field: string;
    label: string;
    /** id cua khoi tren form sua nguoi lao dong */
    section: string;
  };

  type InsuranceHistoryItem = {
    id?: number;
    workPlace?: string;
    address?: string;
    fromDate?: string;
    toDate?: string;
    /** 1 = 国民年金, 2 = 厚生年金保険, 3 = 船員保険, 4 = 共済組合 */
    pensionScheme?: number;
    sortOrder?: number;
  };

  type WorkerListItem = {
    id?: number;

    name?: string;
    nameFurigana?: string;
    gender?: Gender;
    dateOfBirth?: string;
    phoneNumber?: string;
    country?: string;
    leaveJapanDate?: string;
    occupation?: string;

    passportFirstPage?: string;
    passportSecondPage?: string;
    passportStampPage?: string;
    leftProofUrl?: string;

    addressVnPrefectureCode?: string;
    addressVnDistrict?: string;
    addressVnPostalCode?: string;
    addressVnAddress?: string;

    addressJpPostalCode?: string;
    addressJpPrefectureCode?: string;
    addressJpDistrict?: string;
    addressJpHouseNumber?: string;

    residenceCardFrontImage?: string;
    residenceCardBackImage?: string;

    pensionNumber?: string;
    nenkinBookImage?: string;
    /** Anh giay xac nhan cat bao hiem Nenkin (資格喪失証明書). */
    insuranceLossImage?: string;

    bankCountry?: string;
    bankName?: string;
    bankBranchName?: string;
    bankSwiftCode?: string;
    bankBranchAddress?: string;
    bankCity?: string;
    bankAccountName?: string;
    bankAccountNameFurigana?: string;
    bankAccountNumber?: string;
    bankAccountType?: number;
    bankImage?: string;
    bankImageBack?: string;

    taxDeduct?: string;
    taxAmount?: string;
    netPension?: string;
    insuranceHistories?: InsuranceHistoryItem[];

    resultDate1?: string;
    resultDate2?: string;
    nenkinFirstResult?: NenkinResult;
    nenkinSecondResult?: NenkinResult;

    firstPaperStatus?: PaperStatus;
    secondPaperStatus?: PaperStatus;
    firstMissingFields?: MissingField[];
    secondMissingFields?: MissingField[];

    createdById?: string;
    createdBy?: API.UserListItem;
    createAt?: string;
    updatedAt?: string;
  };

  type WorkerList = {
    data?: WorkerListItem[];
    total?: number;
    count?: number;
    page?: number;
    pageCount?: number;
  };

  type WorkerQueryParams = {
    keyword?: string;
    createdById?: string;
    fromDate?: string;
    toDate?: string;
    firstPaperStatus?: PaperStatus;
    secondPaperStatus?: PaperStatus;
    nenkinFirstResult?: NenkinResult;
    nenkinSecondResult?: NenkinResult;
    /** Loc nhanh: trang thai ho so, khong phan biet lan 1 hay lan 2. */
    paperStatus?: PaperStatus;
    /** Loc nhanh: chi lay nguoi lao dong con thieu / da du thong tin. */
    hasLackingInfo?: boolean;
    current?: number;
    pageSize?: number;
  };

  /** Payload tao / sua nguoi lao dong (bo cac truong chi doc). */
  type WorkerForm = Omit<
    WorkerListItem,
    | 'id'
    | 'nenkinFirstResult'
    | 'nenkinSecondResult'
    | 'firstPaperStatus'
    | 'secondPaperStatus'
    | 'firstMissingFields'
    | 'secondMissingFields'
    | 'createdById'
    | 'createdBy'
    | 'createAt'
    | 'updatedAt'
  >;

  type WorkerSearchItem = {
    id?: number;
    name?: string;
    dateOfBirth?: string;
    pensionNumber?: string;
  };

  type WorkerSearchList = {
    data?: WorkerSearchItem[];
    total?: number;
  };

  type UpdateNenkinResultForm = {
    serviceType: NenkinServiceType;
    result: NenkinResult;
    resultDate?: string;
  };
}
