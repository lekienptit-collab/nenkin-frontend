import { t, tv } from '@/utils/t';
import {
  NENKIN_RESULT,
  NENKIN_RESULT_LABELS,
  PAPER_STATUS,
  PAPER_STATUS_FILTER_LABELS,
  PAPER_STATUS_LABELS,
  SERVICE_TYPE,
} from '@/constants/nenkin';
import { searchUsers } from '@/services/nenkin/user';
import { DeleteOutlined, EditOutlined, WarningOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import { Badge, Button, Space, Tag, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

const PAPER_STATUS_COLOR: Record<number, string> = {
  [PAPER_STATUS.NOT_CREATED]: 'default',
  [PAPER_STATUS.INCOMPLETE]: 'warning',
  [PAPER_STATUS.COMPLETE]: 'success',
};

const paperStatusValueEnum = {
  [PAPER_STATUS.NOT_CREATED]: {
    text: PAPER_STATUS_FILTER_LABELS[PAPER_STATUS.NOT_CREATED],
  },
  [PAPER_STATUS.INCOMPLETE]: {
    text: PAPER_STATUS_FILTER_LABELS[PAPER_STATUS.INCOMPLETE],
  },
  [PAPER_STATUS.COMPLETE]: {
    text: PAPER_STATUS_FILTER_LABELS[PAPER_STATUS.COMPLETE],
  },
};

const nenkinResultValueEnum = {
  [NENKIN_RESULT.NOT_YET]: { text: NENKIN_RESULT_LABELS[NENKIN_RESULT.NOT_YET] },
  [NENKIN_RESULT.RETURNED]: { text: NENKIN_RESULT_LABELS[NENKIN_RESULT.RETURNED] },
};

const formatDate = (value?: string) =>
  value ? dayjs(value).format('DD/MM/YYYY') : '';

/** Ô trạng thái hồ sơ + kết quả của 1 lần thủ tục, giống cột trên hệ thống cũ. */
const NenkinCell: React.FC<{
  status?: API.PaperStatus;
  result?: API.NenkinResult;
  missing?: API.MissingField[];
  canEdit: boolean;
  onEdit: () => void;
}> = ({ status, result, missing, canEdit, onEdit }) => {
  const statusTag = (
    <Tag color={PAPER_STATUS_COLOR[status ?? PAPER_STATUS.NOT_CREATED]}>
      {PAPER_STATUS_LABELS[status ?? PAPER_STATUS.NOT_CREATED]}
    </Tag>
  );

  return (
    <Space direction="vertical" size={2}>
      {missing && missing.length > 0 ? (
        <Tooltip
          title={tv('Còn thiếu: {fields}', {
          fields: missing.map((m) => t(m.label)).join(', '),
        })}
        >
          {statusTag}
        </Tooltip>
      ) : (
        statusTag
      )}
      {/* Ngày trả kết quả chỉ hiện ở trang chi tiết: để trong ô này thì nội dung
          rộng hơn cột và link "sửa" bị tràn ra ngoài. */}
      <Space size={6} wrap>
        <Badge
          status={result === NENKIN_RESULT.RETURNED ? 'success' : 'default'}
          text={
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {NENKIN_RESULT_LABELS[result ?? NENKIN_RESULT.NOT_YET]}
            </Typography.Text>
          }
        />
        {canEdit && (
          <Typography.Link style={{ fontSize: 12 }} onClick={onEdit}>
            {t('sửa')}
          </Typography.Link>
        )}
      </Space>
    </Space>
  );
};

export const configColumns = (pa: {
  onEditResult: (record: API.WorkerListItem, serviceType: API.NenkinServiceType) => void;
  onDelete: (record: API.WorkerListItem) => void;
  checkAccess: ACCESS.Check;
}): ProColumns<API.WorkerListItem>[] => [
  {
    title: 'No.',
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 56,
    search: false,
  },
  {
    title: t('Thông tin Người lao động'),
    dataIndex: 'keyword',
    hideInTable: true,
    fieldProps: { placeholder: t('Tên, mã số Nenkin, số điện thoại...') },
  },
  {
    title: t('Họ và tên'),
    dataIndex: 'name',
    search: false,
    render: (_, record) => (
      <Space direction="vertical" size={0}>
        <Space size={4}>
          <Link to={`/workers/${record.id}`}>
            <strong>{record.name}</strong>
          </Link>
          {(record.firstMissingFields?.length || record.secondMissingFields?.length) &&
          pa.checkAccess.updateWorker ? (
            <Tooltip title={t('Người lao động bị thiếu thông tin')}>
              <Link to={`/workers/${record.id}/edit`}>
                <WarningOutlined style={{ color: '#faad14' }} />
              </Link>
            </Tooltip>
          ) : null}
        </Space>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {formatDate(record.dateOfBirth)}
        </Typography.Text>
      </Space>
    ),
  },
  {
    title: t('Mã số nenkin'),
    dataIndex: 'pensionNumber',
    search: false,
    render: (_, record) => record.pensionNumber || '-',
  },
  {
    title: t('Địa chỉ hiện tại'),
    dataIndex: 'addressVnAddress',
    search: false,
    ellipsis: true,
    render: (_, record) => record.addressVnAddress || '-',
  },
  {
    title: t('Nhân viên tạo'),
    dataIndex: 'createdById',
    hideInTable: true,
    valueType: 'select',
    fieldProps: { showSearch: true, allowClear: true },
    request: async ({ keyWords }: { keyWords?: string }) => {
      const res = await searchUsers(keyWords);
      return (res?.data || []).map((u) => ({
        label: u.fullname || u.username,
        value: u.id,
      }));
    },
  },
  {
    title: t('Ngày tạo'),
    dataIndex: 'createdRange',
    valueType: 'dateRange',
    hideInTable: true,
    search: {
      transform: (value: string[]) => ({
        fromDate: value?.[0],
        toDate: value?.[1],
      }),
    },
  },
  {
    title: t('Tạo ngày'),
    dataIndex: 'createAt',
    search: false,
    render: (_, record) => (
      <Space direction="vertical" size={0}>
        <span>{formatDate(record.createAt)}</span>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {t('bởi')}: {record.createdBy?.fullname || record.createdBy?.username || '-'}
        </Typography.Text>
      </Space>
    ),
  },
  {
    title: t('Hồ sơ Nenkin lần 1'),
    dataIndex: 'firstPaperStatus',
    valueType: 'select',
    valueEnum: paperStatusValueEnum,
    width: 220,
    render: (_, record) => (
      <NenkinCell
        status={record.firstPaperStatus}
        result={record.nenkinFirstResult}
        missing={record.firstMissingFields}
        canEdit={!!pa.checkAccess.updateNenkinResult}
        onEdit={() => pa.onEditResult(record, SERVICE_TYPE.FIRST)}
      />
    ),
  },
  {
    title: t('Kết quả Nenkin lần 1'),
    dataIndex: 'nenkinFirstResult',
    valueType: 'select',
    valueEnum: nenkinResultValueEnum,
    hideInTable: true,
  },
  {
    title: t('Hồ sơ Nenkin lần 2'),
    dataIndex: 'secondPaperStatus',
    valueType: 'select',
    valueEnum: paperStatusValueEnum,
    width: 220,
    render: (_, record) => (
      <NenkinCell
        status={record.secondPaperStatus}
        result={record.nenkinSecondResult}
        missing={record.secondMissingFields}
        canEdit={!!pa.checkAccess.updateNenkinResult}
        onEdit={() => pa.onEditResult(record, SERVICE_TYPE.SECOND)}
      />
    ),
  },
  {
    title: t('Kết quả Nenkin lần 2'),
    dataIndex: 'nenkinSecondResult',
    valueType: 'select',
    valueEnum: nenkinResultValueEnum,
    hideInTable: true,
  },
  {
    title: t('Thao tác'),
    dataIndex: 'option',
    valueType: 'option',
    width: 120,
    fixed: 'right',
    render: (_, record) => (
      <Space key="actions">
        {pa.checkAccess.updateWorker && (
          <Tooltip title={t('Sửa')}>
            <Link to={`/workers/${record.id}/edit`}>
              <Button size="small" type="text" icon={<EditOutlined />} />
            </Link>
          </Tooltip>
        )}
        {pa.checkAccess.deleteWorker && (
          <Tooltip title={t('Xoá')}>
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
