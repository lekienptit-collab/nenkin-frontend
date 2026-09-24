import { t, tv } from '@/utils/t';
import access from '@/access';
import { SERVICE_TYPE, WORKER_QUICK_FILTERS } from '@/constants/nenkin';
import {
  deleteWorkers,
  updateNenkinResult,
  workers as queryWorkers,
} from '@/services/nenkin/worker';
import { getErrorCode } from '@/utils/error';
import { showTotal } from '@/utils/table';
import { PlusOutlined, TagsOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Button, message, Modal, Space } from 'antd';
import React, { useRef, useState } from 'react';
import { configColumns } from './columns';
import NenkinResultModal from './components/NenkinResultModal';
import styles from './index.less';

const ERROR_MESSAGES: Record<string, string> = {
  WORKER_NOT_FOUND: t('Không tìm thấy người lao động.'),
};

const showError = (error: any, fallback: string) => {
  const code = getErrorCode(error);
  message.error(ERROR_MESSAGES[code] || fallback);
};

const WorkerList: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const checkAccess = access(initialState);

  const actionRef = useRef<ActionType>();
  const [resultTarget, setResultTarget] = useState<{
    worker: API.WorkerListItem;
    serviceType: API.NenkinServiceType;
  }>();
  /**
   * Lọc nhanh nằm ngoài form tìm kiếm của ProTable. Truyền qua `params` để
   * ProTable tự gọi lại API mỗi khi đổi, và bấm lại nút đang chọn thì bỏ lọc.
   */
  const [quickFilter, setQuickFilter] = useState<{
    key?: string;
    params: Record<string, any>;
  }>({ params: {} });

  const toggleQuickFilter = (key: string, params: Record<string, any>) =>
    setQuickFilter((current) =>
      current.key === key ? { params: {} } : { key, params },
    );

  const handleRemove = (record: API.WorkerListItem) => {
    Modal.confirm({
      title: tv('Bạn chắc chắn muốn xoá người lao động "{name}"?', {
        name: record.name,
      }),
      content: t('Hồ sơ Nenkin đã làm cho người này cũng sẽ không còn truy cập được.'),
      okText: t('Xoá'),
      okButtonProps: { danger: true },
      cancelText: t('Huỷ'),
      onOk: async () => {
        try {
          await deleteWorkers([record.id!]);
          message.success(t('Đã xoá thành công.'));
          actionRef.current?.reload();
        } catch (error) {
          showError(error, t('Quá trình xoá bị lỗi. Xin thử lại!'));
        }
      },
    });
  };

  const handleUpdateResult = async (values: API.UpdateNenkinResultForm) => {
    try {
      await updateNenkinResult(resultTarget!.worker.id!, values);
      message.success(t('Đã cập nhật kết quả Nenkin.'));
      setResultTarget(undefined);
      actionRef.current?.reload();
    } catch (error) {
      showError(error, t('Cập nhật bị lỗi. Xin thử lại!'));
    }
  };

  const columns = configColumns({
    onEditResult: (worker, serviceType) => setResultTarget({ worker, serviceType }),
    onDelete: handleRemove,
    checkAccess,
  });

  return (
    <PageContainer
      title={t('Người lao động')}
      content={t('Hồ sơ người lao động cùng tình trạng giấy tờ và kết quả của từng lần thủ tục Nenkin.')}
    >
      <ProTable<API.WorkerListItem, API.WorkerQueryParams>
        headerTitle={t('Danh sách người lao động')}
        size={TABLE_SIZE}
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 180 }}
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showTotal: showTotal(t('người lao động')),
        }}
        scroll={{ x: 1200 }}
        params={quickFilter.params}
        onRow={(record) => ({
          // Bấm vào dòng mở chi tiết, trừ khi bấm trúng nút/liên kết trong dòng.
          onClick: (event) => {
            if (!(event.target as HTMLElement).closest('a, button, .ant-btn')) {
              history.push(`/workers/${record.id}`);
            }
          },
          style: { cursor: 'pointer' },
        })}
        tableExtraRender={() => (
          <div className={styles.quickBar}>
            <span className={styles.quickLabel}>
              <TagsOutlined /> {t('Tìm nhanh')}
            </span>
            <Space size={[8, 8]} wrap>
              {WORKER_QUICK_FILTERS.map((f) => (
                <Button
                  key={f.key}
                  size="small"
                  shape="round"
                  className={styles.quickChip}
                  type={quickFilter.key === f.key ? 'primary' : 'default'}
                  onClick={() => toggleQuickFilter(f.key, f.params)}
                >
                  {f.label}
                </Button>
              ))}
              {quickFilter.key && (
                <Button
                  size="small"
                  type="link"
                  onClick={() => setQuickFilter({ params: {} })}
                >
                  {t('Bỏ lọc')}
                </Button>
              )}
            </Space>
          </div>
        )}
        toolBarRender={() => [
          checkAccess.createWorker && (
            <Button
              type="primary"
              key="create"
              icon={<PlusOutlined />}
              onClick={() => history.push('/workers/create')}
            >
              {t('Thêm mới')}
            </Button>
          ),
        ]}
        request={async (params) => {
          const res = await queryWorkers(params);
          return {
            data: res?.data || [],
            total: res?.total || 0,
            success: true,
          };
        }}
        columns={columns}
      />

      <NenkinResultModal
        open={!!resultTarget}
        worker={resultTarget?.worker}
        serviceType={resultTarget?.serviceType ?? SERVICE_TYPE.FIRST}
        onCancel={() => setResultTarget(undefined)}
        onSubmit={handleUpdateResult}
      />
    </PageContainer>
  );
};

export default WorkerList;
