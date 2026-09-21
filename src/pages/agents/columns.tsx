import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import { Button, Space, Tooltip, Typography } from 'antd';
import React from 'react';

export const configColumns = (pa: {
  onDelete: (record: API.AgentListItem) => void;
  checkAccess: ACCESS.Check;
  accountTypes?: API.OptionItem[];
}): ProColumns<API.AgentListItem>[] => [
  {
    title: 'No.',
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 56,
    search: false,
  },
  {
    title: 'Thông tin người đại diện',
    dataIndex: 'keyword',
    hideInTable: true,
    fieldProps: { placeholder: 'Họ tên, phiên âm, số điện thoại...' },
  },
  {
    title: 'Họ và tên',
    dataIndex: 'name',
    search: false,
    render: (_, record) => (
      <Space direction="vertical" size={0}>
        <Link to={`/agents/${record.id}`}>
          <strong>{record.name}</strong>
        </Link>
        {record.nameFurigana && (
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {record.nameFurigana}
          </Typography.Text>
        )}
      </Space>
    ),
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'phoneNumber',
    search: false,
    render: (_, record) => record.phoneNumber || '-',
  },
  {
    title: 'Nghề nghiệp ở Nhật Bản',
    dataIndex: 'occupation',
    search: false,
    render: (_, record) => record.occupation || '-',
  },
  {
    title: 'Ngân hàng',
    dataIndex: 'bankName',
    search: false,
    render: (_, record) =>
      [record.bankName, record.bankBranchName].filter(Boolean).join(' - ') || '-',
  },
  {
    title: 'Thao tác',
    dataIndex: 'option',
    valueType: 'option',
    width: 120,
    render: (_, record) => (
      <Space key="actions">
        {pa.checkAccess.updateAgent && (
          <Tooltip title="Sửa">
            <Link to={`/agents/${record.id}/edit`}>
              <Button size="small" type="text" icon={<EditOutlined />} />
            </Link>
          </Tooltip>
        )}
        {pa.checkAccess.deleteAgent && (
          <Tooltip title="Xoá">
            <Button
              size="small"
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => pa.onDelete(record)}
            />
          </Tooltip>
        )}
      </Space>
    ),
  },
];
