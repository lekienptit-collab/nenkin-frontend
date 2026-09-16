declare namespace API {
  type UserListItem = {
    id?: string;
    username?: string;
    email?: string;
    password?: string;
    isActive?: boolean;
    roleId?: number;
    role?: API.RoleListItem;
    fullname?: string;
    phone?: string;
    address?: string;
    birthday?: string;
    avatar?: string;
    note?: string;
    isSuperUser?: boolean;
    createAt?: string;
    updatedAt?: string;
  };

  type UserList = {
    data?: UserListItem[];
    total?: number;
    count?: number;
    page?: number;
    pageCount?: number;
  };

  type UserQueryParams = {
    username?: string;
    email?: string;
    fullname?: string;
    phone?: string;
    roleId?: number;
    isActive?: boolean;
    current?: number;
    pageSize?: number;
  };

  type UserCreateForm = {
    username?: string;
    email?: string;
    password?: string;
    roleId?: number;
    fullname?: string;
    phone?: string;
    address?: string;
    birthday?: string;
    note?: string;
    isActive?: boolean;
  };

  type UserUpdateForm = {
    email?: string;
    password?: string;
    roleId?: number;
    fullname?: string;
    phone?: string;
    address?: string;
    birthday?: string;
    note?: string;
    isActive?: boolean;
  };

  type UserUpdateMeForm = {
    email?: string;
    fullname?: string;
    phone?: string;
    address?: string;
    birthday?: string;
    avatar?: string;
    note?: string;
  };

  type UserUpdatePasswordForm = {
    oldPassword?: string;
    newPassword?: string;
  };
}
