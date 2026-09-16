declare namespace API {
  type CurrentUser = {
    id?: string;
    username?: string;
    email?: string;
    fullname?: string;
    phone?: string;
    address?: string;
    avatar?: string;
    birthday?: string;
    note?: string;
    isActive?: boolean;
    isSuperUser?: boolean;
    isAdmin?: boolean;
    roleId?: number;
    /** slug cua role */
    role?: string;
    roleName?: string;
    permissions?: string[];
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type ResSuccess = {
    success?: boolean;
  };

  type LoginParams = {
    username?: string;
    password?: string;
  };

  type RefreshTokenParams = {
    refreshToken?: string;
  };

  type LogoutParams = {
    token?: string;
  };
}
