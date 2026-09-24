import { t } from '@/utils/t';
import { DeleteOutlined, SafetyOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';
import React from 'react';

export const configColumns = (pa: {
  onUpdate: (e: API.RoleListItem) => void;
  onDelete: (e: API.RoleListItem) => void;
  onPermissionAssign: (e: API.RoleListItem) => void;
  checkAccess: ACCESS.Check;
}): ProColumns<API.RoleListItem>[] => {
  return [
    {
      title: t('Tên quyền'),
      dataIndex: 'name',
      render: (_, record) => <strong>{record.name}</strong>,
    },
    {
      title: t('Mã quyền'),
      dataIndex: 'slug',
      render: (_, record) => <Tag>{record.slug}</Tag>,
    },
    {
      title: t('Quyền cha'),
      dataIndex: 'parent',
      render: (_, record) => record?.parent?.name || '-',
    },
    {
      title: t('Số permission'),
      dataIndex: 'permissions',
      search: false,
      render: (_, record) => {
        if (record.permissions?.includes('all')) {
          return <Tag color="red">{t('Toàn quyền')}</Tag>;
        }
        return record.permissions?.length || 0;
      },
    },
    {
      title: t('Loại'),
      dataIndex: 'isCanEdit',
      search: false,
      render: (_, record) =>
        record.isCanEdit ? <Tag color="blue">{t('Tuỳ chỉnh')}</Tag> : <Tag>{t('Mặc định')}</Tag>,
    },
    {
      title: t('Cập nhật lúc'),
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: t('Thao tác'),
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space key="actions">
          {pa.checkAccess.updateRole && (
            <a key="update" onClick={() => pa.onUpdate(record)}>
              {t('Sửa')}
            </a>
          )}
          {pa.checkAccess.updateRolePermissions && (
            <a key="permission" onClick={() => pa.onPermissionAssign(record)}>
              <SafetyOutlined /> {t('Phân quyền')}
            </a>
          )}
          {pa.checkAccess.deleteRole && record.isCanEdit && (
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
      ),
    },
  ];
};
