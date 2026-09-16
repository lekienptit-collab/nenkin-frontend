declare namespace API {
  type RoleListItem = {
    id: number;
    slug?: string;
    name?: string;
    roleId?: number;
    parent?: {
      id?: number;
      name?: string;
      slug?: string;
    };
    children?: RoleListItem[];
    permissions?: string[];
    isCanEdit?: boolean;
    isActive?: boolean;
    createAt?: string;
    updatedAt?: string;
  };

  type RoleList = {
    data?: RoleListItem[];
    total?: number;
    count?: number;
    page?: number;
    pageCount?: number;
  };

  type RoleQueryParams = {
    name?: string;
    slug?: string;
    parent?: string;
    current?: number;
    pageSize?: number;
  };

  type RoleCreateForm = {
    name?: string;
    slug?: string;
    roleId?: number;
    permissions?: string[];
  };

  type RoleToCustomPermission = {
    id?: number;
    name?: string;
    slug?: string;
    permissions?: string[];
    /** quyen toi da role cha cho phep; ['all'] nghia la khong gioi han */
    permissionParent?: string[];
  };

  /** { NHOM: ['PERMISSION', ...] } */
  type PermissionGroup = Record<string, string[]>;
}
