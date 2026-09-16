/**
 * Nhan hien thi cho nhom quyen va tung permission.
 * Backend tra ve cau truc { NHOM: ['PERMISSION', ...] } tu GET /roles/permissions,
 * o day chi map sang tieng Viet. Them permission moi thi bo sung 1 dong vao day.
 */

export const GROUP_LABELS: Record<string, string> = {
  USER: 'Quản lý thành viên',
  ROLES: 'Quản lý quyền',
};

export const PERMISSION_LABELS: Record<string, string> = {
  GET_USER: 'Xem danh sách thành viên',
  CREATE_USER: 'Thêm thành viên',
  UPDATE_USER: 'Sửa thành viên',
  DELETE_USER: 'Xoá thành viên',
  BANED_USER: 'Khoá / mở khoá thành viên',

  GET_ROLES: 'Xem danh sách quyền',
  CREATE_ROLES: 'Tạo quyền',
  UPDATE_ROLES: 'Sửa quyền',
  DELETE_ROLES: 'Xoá quyền',
  UPDATE_ROLE_PERMISSIONS: 'Phân quyền chi tiết',
};

export const getGroupLabel = (key: string): string => GROUP_LABELS[key] || key;

export const getPermissionLabel = (key: string): string => PERMISSION_LABELS[key] || key;
