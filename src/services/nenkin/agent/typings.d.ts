declare namespace API {
  /** 1 = Thong thuong, 2 = Sec, 3 = Tiet kiem */
  type BankAccountType = 1 | 2 | 3;

  type AgentListItem = {
    id?: number;
    name?: string;
    nameFurigana?: string;
    phoneNumber?: string;
    occupation?: string;

    bankName?: string;
    bankBranchName?: string;
    bankAccountName?: string;
    bankAccountNumber?: string;
    bankAccountType?: BankAccountType;

    addressPostalCode?: string;
    addressDetail?: string;

    createdById?: string;
    createdBy?: API.UserListItem;
    createAt?: string;
    updatedAt?: string;
  };

  type AgentList = {
    data?: AgentListItem[];
    total?: number;
    count?: number;
    page?: number;
    pageCount?: number;
  };

  type AgentQueryParams = {
    keyword?: string;
    current?: number;
    pageSize?: number;
  };

  type AgentForm = Omit<
    AgentListItem,
    'id' | 'createdById' | 'createdBy' | 'createAt' | 'updatedAt'
  >;

  type AgentSearchItem = {
    id?: number;
    name?: string;
    nameFurigana?: string;
    phoneNumber?: string;
  };

  type AgentSearchList = {
    data?: AgentSearchItem[];
    total?: number;
  };
}
