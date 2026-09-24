import { t } from '@/utils/t';
import { getRoles } from '@/services/nenkin/role';
import { DeleteOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { Badge, Button, Space, Switch } from 'antd';
import React from 'react';

export const configColumns = (pa: {
  onUpdate: (e: API.UserListItem) => void;
  onDelete: (e: API.UserListItem) => void;
  onToggleActive: (e: API.UserListItem, isActive: boolean) => void;
  checkAccess: ACCESS.Check;
  currentUserId?: string;
}): ProColumns<API.UserListItem>[] => {
  return [
    {
      title: t('Tên đăng nhập'),
      dataIndex: 'username',
      render: (_, record) => <strong>{record.username}</strong>,
    },
    {
      title: t('Họ tên'),
      dataIndex: 'fullname',
      render: (_, record) => record.fullname || '-',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: t('Điện thoại'),
      dataIndex: 'phone',
      render: (_, record) => record.phone || '-',
    },
    {
      title: t('Vai trò'),
      dataIndex: 'roleId',
      valueType: 'select',
      request: async () => {
        const roles = await getRoles();
        return roles.map((r) => ({ label: r.name, value: r.id }));
      },
      render: (_, record) => record.role?.name || '-',
    },
    {
      title: t('Trạng thái'),
      dataIndex: 'isActive',
      valueType: 'select',
      valueEnum: {
        true: { text: t('Đang hoạt động'), status: 'Success' },
        false: { text: t('Đã khoá'), status: 'Default' },
      },
      render: (_, record) => {
        const isSelf = record.id === pa.currentUserId;
        if (!pa.checkAccess.banUser || isSelf) {
          return (
            <Badge
              status={record.isActive ? 'success' : 'default'}
              text={record.isActive ? t('Đang hoạt động') : t('Đã khoá')}
            />
          );
        }
        return (
          <Switch
            size="small"
            checked={record.isActive}
            checkedChildren={t('Bật')}
            unCheckedChildren={t('Khoá')}
            onChange={(checked) => pa.onToggleActive(record, checked)}
          />
        );
      },
    },
    {
      title: t('Ngày tạo'),
      dataIndex: 'createAt',
      valueType: 'dateTime',
      search: false,
      sorter: false,
    },
    {
      title: t('Thao tác'),
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        const isSelf = record.id === pa.currentUserId;
        return (
          <Space key="actions">
            {pa.checkAccess.updateUser && (
              <a key="update" onClick={() => pa.onUpdate(record)}>
                {t('Sửa')}
              </a>
            )}
            {pa.checkAccess.deleteUser && !isSelf && (
              <Button
                key="delete"
                size="small"
                danger
                type="primary"
                icon={<DeleteOutlined />}
                onClick={() => pa.onDelete(record)}
              >
                {t('Xoá')}
              </Button>
            )}
          </Space>
        );
      },
    },
  ];
};
