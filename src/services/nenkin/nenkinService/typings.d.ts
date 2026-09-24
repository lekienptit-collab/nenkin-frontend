declare namespace API {
  /** PENDING = chua co file PDF (chua cau hinh mau), GENERATED = da sinh file */
  type NenkinDocumentStatus = 'PENDING' | 'GENERATED';

  type NenkinDocumentItem = {
    id?: number;
    procedureId?: number;
    code?: string;
    name?: string;
    fileUrl?: string;
    status?: NenkinDocumentStatus;
    sortOrder?: number;
    createAt?: string;
    updatedAt?: string;
  };

  type NenkinProcedureItem = {
    id?: number;
    workerId?: number;
    worker?: API.WorkerListItem;
    agentId?: number;
    agent?: API.AgentListItem;
    serviceType?: NenkinServiceType;
    /** 1 = ve nuoc han, 2 = quay lai Nhat */
    caseType?: number;
    relation?: string;

    requestDate?: string;
    entrustDate?: string;

    taxRequestDate?: string;
    taxEntrustDate?: string;
    taxOffice?: string;

    documents?: NenkinDocumentItem[];
    /** File PDF gop ca bo giay to. */
    mergedFileUrl?: string;
    missingFields?: MissingField[];

    createdById?: string;
    createdBy?: API.UserListItem;
    createAt?: string;
    updatedAt?: string;
  };

  type NenkinProcedureList = {
    data?: NenkinProcedureItem[];
    total?: number;
  };

  type NenkinProcedureForm = {
    serviceType: NenkinServiceType;
    workerId: number;
    /** Bo trong khi nguoi lao dong quay lai Nhat. */
    agentId?: number;
    relation?: string;
    caseType?: number;
    requestDate?: string;
    entrustDate?: string;
    taxRequestDate?: string;
    taxEntrustDate?: string;
    taxOffice?: string;
    resultDate1?: string;
  };

  type NenkinPaperTemplate = {
    code: string;
    name: string;
    /** Giấy tờ chỉ đính kèm bản scan người lao động nộp, hệ thống không tự điền. */
    scanned?: boolean;
  };

  /** { '1': [...], '2': [...] } */
  type NenkinPaperTemplates = Record<string, NenkinPaperTemplate[]>;
}
