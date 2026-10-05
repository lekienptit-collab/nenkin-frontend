declare namespace API {
  type OptionItem = {
    value: string;
    label: string;
  };

  type BankItem = OptionItem & {
    /** '81' = ngan hang Nhat, '84' = ngan hang Viet Nam */
    country: string;
    swiftCode: string;
  };

  type MasterData = {
    jpPrefectures: OptionItem[];
    vnProvinces: OptionItem[];
    banks: BankItem[];
    bankAccountTypes: OptionItem[];
    agentRelations: OptionItem[];
  };

  type JpPostalAddress = {
    prefectureCode: string;
    prefectureName: string;
    district: string;
  };

  type JpPostalAddressList = {
    results: JpPostalAddress[];
  };

  type JpPostalCodeMatch = {
    /** Dang 123-4567 */
    postalCode: string;
    /** 市区町村 theo 日本郵便, vd "東かがわ市" */
    city: string;
    /** 町域 nguyen van; rong khi la ma chung cua ca 市区町村 */
    town: string;
  };

  type JpPostalCodeLookup = {
    /** town = thay dung khu pho, city = chi thay 市区町村, none = khong nhan ra dia chi */
    matchLevel: 'town' | 'city' | 'none';
    results: JpPostalCodeMatch[];
  };

  type TaxOffice = {
    code: string;
    /** Ten ngan luu vao ho so: "長尾" */
    name: string;
    /** "長尾税務署" */
    fullName: string;
    kana?: string;
    prefecture: string;
    prefectureCode: string;
    location: { postalCode?: string; address: string };
    /** Noi nhan ho so gui qua buu dien; null thi gui thang toi so thue. */
    mailing: { note?: string; postalCode?: string; lines: string[] } | null;
    phone?: string;
    jurisdiction: string;
    url?: string;
    detailUrls?: string[];
  };

  type TaxOfficeList = {
    data: TaxOffice[];
    /** Trang tra cuu toan bo so thue cua 国税庁 */
    searchUrl: string;
  };

  type TaxOfficeSuggestion = {
    office?: TaxOffice;
    candidates: TaxOffice[];
    /** address = tra theo khu vuc quan ly, ai = AI chon, none = chua chon duoc */
    method: 'address' | 'ai' | 'none';
    city?: string;
    reason?: string;
    searchUrl: string;
  };

  type UploadResult = {
    url: string;
    name: string;
  };
}
