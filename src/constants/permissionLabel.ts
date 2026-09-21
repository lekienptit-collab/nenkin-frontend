/**
 * Nhan hien thi cho nhom quyen va tung permission.
 * Backend tra ve cau truc { NHOM: ['PERMISSION', ...] } tu GET /roles/permissions,
 * o day chi map sang tieng Viet. Them permission moi thi bo sung 1 dong vao day.
 */

export const GROUP_LABELS: Record<string, string> = {
  USER: 'Quản lý thành viên',
  ROLES: 'Quản lý quyền',
  WORKER: 'Người lao động',
  AGENT: 'Người đại diện',
  NENKIN_SERVICE: 'Thủ tục Nenkin',
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

  GET_WORKER: 'Xem danh sách người lao động',
  CREATE_WORKER: 'Thêm người lao động',
  UPDATE_WORKER: 'Sửa người lao động',
  DELETE_WORKER: 'Xoá người lao động',
  UPDATE_NENKIN_RESULT: 'Cập nhật kết quả Nenkin',

  GET_AGENT: 'Xem danh sách người đại diện',
  CREATE_AGENT: 'Thêm người đại diện',
  UPDATE_AGENT: 'Sửa người đại diện',
  DELETE_AGENT: 'Xoá người đại diện',

  GET_NENKIN_SERVICE: 'Xem hồ sơ thủ tục Nenkin',
  CREATE_NENKIN_SERVICE: 'Tạo / cập nhật hồ sơ Nenkin',
  DELETE_NENKIN_SERVICE: 'Xoá hồ sơ Nenkin',
};

export const getGroupLabel = (key: string): string => GROUP_LABELS[key] || key;

export const getPermissionLabel = (key: string): string => PERMISSION_LABELS[key] || key;
