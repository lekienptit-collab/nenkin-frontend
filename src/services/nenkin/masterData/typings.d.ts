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

  type UploadResult = {
    url: string;
    name: string;
  };
}
