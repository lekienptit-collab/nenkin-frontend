import { t } from '@/utils/t';

/**
 * Nhan hien thi cho nhom quyen va tung permission.
 * Backend tra ve cau truc { NHOM: ['PERMISSION', ...] } tu GET /roles/permissions,
 * o day chi map sang tieng Viet. Them permission moi thi bo sung 1 dong vao day.
 */

export const GROUP_LABELS: Record<string, string> = {
  USER: t('Quản lý thành viên'),
  ROLES: t('Quản lý quyền'),
  WORKER: t('Người lao động'),
  AGENT: t('Người đại diện'),
  NENKIN_SERVICE: t('Thủ tục Nenkin'),
};

export const PERMISSION_LABELS: Record<string, string> = {
  GET_USER: t('Xem danh sách thành viên'),
  CREATE_USER: t('Thêm thành viên'),
  UPDATE_USER: t('Sửa thành viên'),
  DELETE_USER: t('Xoá thành viên'),
  BANED_USER: t('Khoá / mở khoá thành viên'),

  GET_ROLES: t('Xem danh sách quyền'),
  CREATE_ROLES: t('Tạo quyền'),
  UPDATE_ROLES: t('Sửa quyền'),
  DELETE_ROLES: t('Xoá quyền'),
  UPDATE_ROLE_PERMISSIONS: t('Phân quyền chi tiết'),

  GET_WORKER: t('Xem danh sách người lao động'),
  CREATE_WORKER: t('Thêm người lao động'),
  UPDATE_WORKER: t('Sửa người lao động'),
  DELETE_WORKER: t('Xoá người lao động'),
  UPDATE_NENKIN_RESULT: t('Cập nhật kết quả Nenkin'),

  GET_AGENT: t('Xem danh sách người đại diện'),
  CREATE_AGENT: t('Thêm người đại diện'),
  UPDATE_AGENT: t('Sửa người đại diện'),
  DELETE_AGENT: t('Xoá người đại diện'),

  GET_NENKIN_SERVICE: t('Xem hồ sơ thủ tục Nenkin'),
  CREATE_NENKIN_SERVICE: t('Tạo / cập nhật hồ sơ Nenkin'),
  DELETE_NENKIN_SERVICE: t('Xoá hồ sơ Nenkin'),
};

export const getGroupLabel = (key: string): string => GROUP_LABELS[key] || key;

export const getPermissionLabel = (key: string): string => PERMISSION_LABELS[key] || key;
