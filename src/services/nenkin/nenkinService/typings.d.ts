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
    agentId: number;
    relation: string;
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
  };

  /** { '1': [...], '2': [...] } */
  type NenkinPaperTemplates = Record<string, NenkinPaperTemplate[]>;
}
