import { t, tv } from '@/utils/t';
import access from '@/access';
import ImageUploader from '@/components/ImageUploader';
import {
  BANK_COUNTRY_OPTIONS,
  GENDER_LABELS,
  NENKIN_RESULT,
  NENKIN_RESULT_LABELS,
  SERVICE_TYPE,
  SERVICE_TYPE_LABELS,
} from '@/constants/nenkin';
import { masterData as queryMasterData } from '@/services/nenkin/masterData';
import {
  downloadNenkinDocument,
  downloadNenkinProcedure,
  nenkinProcedures as queryProcedures,
  previewNenkinPdf,
} from '@/services/nenkin/nenkinService';
import { getWorker } from '@/services/nenkin/worker';
import {
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { PageContainer, ProCard, ProDescriptions } from '@ant-design/pro-components';
import { history, Link, useModel, useParams } from '@umijs/max';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Empty,
  message,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { useFetch } from '@/utils/useFetch';

const formatDate = (value?: string) =>
  value ? dayjs(value).format('DD/MM/YYYY') : '-';

const formatYen = (value?: string) =>
  value === null || value === undefined || value === ''
    ? '-'
    : `${Number(value).toLocaleString('ja-JP')} ¥`;

const findLabel = (options?: API.OptionItem[], value?: string) =>
  options?.find((o) => o.value === value)?.label || value || '-';

/** Tai/xem file PDF là thao tác gọi API nên phải báo lỗi rõ khi thất bại. */
const withError = async (action: () => Promise<void>) => {
  try {
    await action();
  } catch (error) {
    message.error(t('Không mở được file PDF. Xin thử lại!'));
  }
};

/** Bảng giấy tờ đã sinh của một lần thủ tục. */
const PaperTable: React.FC<{
  serviceType: API.NenkinServiceType;
  procedure?: API.NenkinProcedureItem;
  workerId: number;
  canCreate: boolean;
}> = ({ serviceType, procedure, workerId, canCreate }) => (
  <Card
    title={SERVICE_TYPE_LABELS[serviceType]}
    style={{ marginBottom: 16 }}
    extra={
      canCreate && (
        <Button
          size="small"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() =>
            history.push(`/nenkin/request/${serviceType}?workerId=${workerId}`)
          }
        >
          {t('Tạo/Cập nhật')}
        </Button>
      )
    }
  >
    {!procedure ? (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={t('Chưa làm thủ tục lần này')}
      />
    ) : (
      <>
        <ProDescriptions column={{ xs: 1, md: 3 }} size="small" style={{ marginBottom: 12 }}>
          <ProDescriptions.Item label={t('Người được uỷ quyền')}>
            {procedure.agent?.name || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('Quan hệ')}>
            {procedure.relation || '-'}
          </ProDescriptions.Item>
          {serviceType === SERVICE_TYPE.FIRST ? (
            <>
              <ProDescriptions.Item label={t('Ngày làm đơn')}>
                {formatDate(procedure.requestDate)}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={t('Ngày uỷ quyền')}>
                {formatDate(procedure.entrustDate)}
              </ProDescriptions.Item>
            </>
          ) : (
            <>
              <ProDescriptions.Item label={t('Ngày làm đơn khai thuế')}>
                {formatDate(procedure.taxRequestDate)}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={t('Ngày uỷ quyền khai thuế')}>
                {formatDate(procedure.taxEntrustDate)}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={t('Văn phòng thuế')}>
                {procedure.taxOffice || '-'}
              </ProDescriptions.Item>
            </>
          )}
        </ProDescriptions>

        {procedure.mergedFileUrl && (
          <div style={{ textAlign: 'right', marginBottom: 8 }}>
            <Space>
              <Button
                icon={<EyeOutlined />}
                onClick={() =>
                  withError(() => previewNenkinPdf('procedures', procedure.id!))
                }
              >
                {t('Xem trước')}
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={() =>
                  withError(() =>
                    downloadNenkinProcedure(
                      procedure.id!,
                      `nenkin-lan-${serviceType}-${workerId}.pdf`,
                    ),
                  )
                }
              >
                {t('Tải cả bộ hồ sơ')}
              </Button>
            </Space>
          </div>
        )}

        <Table<API.NenkinDocumentItem>
          size="small"
          rowKey="id"
          pagination={false}
          dataSource={procedure.documents || []}
          columns={[
            {
              title: 'No.',
              width: 56,
              render: (_, __, index) => index + 1,
            },
            {
              title: t('Tên giấy tờ'),
              dataIndex: 'name',
              render: (value) => t(String(value ?? '')),
            },
            {
              title: t('Ngày tạo'),
              dataIndex: 'createAt',
              width: 120,
              render: (value) => formatDate(value),
            },
            {
              title: t('Tải xuống'),
              width: 180,
              render: (_, record) =>
                record.status === 'GENERATED' ? (
                  <Space size={10}>
                    <Typography.Link
                      onClick={() =>
                        withError(() => previewNenkinPdf('documents', record.id!))
                      }
                    >
                      {t('Xem trước')}
                    </Typography.Link>
                    <Typography.Link
                      onClick={() =>
                        withError(() =>
                          downloadNenkinDocument(
                            record.id!,
                            `${record.code}.pdf`,
                          ),
                        )
                      }
                    >
                      {t('Tải PDF')}
                    </Typography.Link>
                  </Space>
                ) : (
                  <Tag color="default">{t('Chưa có file PDF')}</Tag>
                ),
            },
          ]}
        />
      </>
    )}
  </Card>
);

const WorkerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const workerId = Number(id);
  const { initialState } = useModel('@@initialState');
  const checkAccess = access(initialState);

  const { data: master } = useFetch<API.MasterData>(() => queryMasterData());
  const { data: worker, loading } = useFetch<API.WorkerListItem>(
    () => getWorker(workerId),
    [workerId],
  );
  const { data: procedures } = useFetch<API.NenkinProcedureList>(
    () => queryProcedures({ workerId }),
    [workerId],
    { ready: !!checkAccess.listNenkinService },
  );

  const byType = (serviceType: API.NenkinServiceType) =>
    procedures?.data?.find((p) => p.serviceType === serviceType);

  const missing = [
    ...(worker?.firstMissingFields || []),
    ...(worker?.secondMissingFields || []),
  ];
  const missingLabels = Array.from(new Set(missing.map((m) => m.label)));

  const infoTab = (
    <>
      <ProCard title={t('Thông tin cá nhân - hộ chiếu')} bordered style={{ marginBottom: 16 }}>
        <ProDescriptions column={{ xs: 1, md: 3 }}>
          <ProDescriptions.Item label={t('Họ và tên')}>{worker?.name}</ProDescriptions.Item>
          <ProDescriptions.Item label={t('Giới tính')}>
            {worker?.gender === undefined ? '-' : GENDER_LABELS[worker.gender]}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('Ngày tháng năm sinh')}>
            {formatDate(worker?.dateOfBirth)}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('Số điện thoại')}>
            {worker?.phoneNumber || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('Quốc tịch')}>
            {worker?.country || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('Ngày rời Nhật Bản')}>
            {formatDate(worker?.leaveJapanDate)}
          </ProDescriptions.Item>
        </ProDescriptions>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <div>{t('Ảnh hộ chiếu (trang đầu)')}</div>
            <ImageUploader readOnly value={worker?.passportFirstPage} />
          </Col>
          <Col xs={24} md={8}>
            <div>{t('Ảnh hộ chiếu (trang hai)')}</div>
            <ImageUploader readOnly value={worker?.passportSecondPage} />
          </Col>
          <Col xs={24} md={8}>
            <div>{t('Ảnh hộ chiếu (trang có dấu)')}</div>
            <ImageUploader readOnly value={worker?.passportStampPage} />
          </Col>
        </Row>
      </ProCard>

      <ProCard title={t('Thông tin địa chỉ')} bordered style={{ marginBottom: 16 }}>
        <ProDescriptions column={{ xs: 1, md: 2 }}>
          <ProDescriptions.Item label={t('Tỉnh (hiện tại)')}>
            {findLabel(master?.vnProvinces, worker?.addressVnPrefectureCode)}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('Thành phố/Huyện')}>
            {worker?.addressVnDistrict || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('Mã bưu điện (Việt Nam)')}>
            {worker?.addressVnPostalCode || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('Địa chỉ tại Việt Nam')}>
            {worker?.addressVnAddress || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('Mã bưu điện (Nhật Bản)')}>
            {worker?.addressJpPostalCode || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('Địa chỉ cuối cùng ở Nhật Bản')}>
            {[
              findLabel(master?.jpPrefectures, worker?.addressJpPrefectureCode),
              worker?.addressJpDistrict,
              worker?.addressJpHouseNumber,
            ]
              .filter((v) => v && v !== '-')
              .join(' ') || '-'}
          </ProDescriptions.Item>
        </ProDescriptions>
        <div>{t('Giấy tờ chứng minh đã rời Nhật Bản')}</div>
        <ImageUploader readOnly value={worker?.leftProofUrl} />
      </ProCard>

      <ProCard title={t('Thông tin thẻ ngoại kiều')} bordered style={{ marginBottom: 16 }}>
        <ProDescriptions column={1}>
          <ProDescriptions.Item label={t('Nghề nghiệp ở Nhật Bản')}>
            {worker?.occupation || '-'}
          </ProDescriptions.Item>
        </ProDescriptions>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <div>{t('Ảnh thẻ ngoại kiều (mặt trước)')}</div>
            <ImageUploader readOnly value={worker?.residenceCardFrontImage} />
          </Col>
          <Col xs={24} md={12}>
            <div>{t('Ảnh thẻ ngoại kiều (mặt sau)')}</div>
            <ImageUploader readOnly value={worker?.residenceCardBackImage} />
          </Col>
        </Row>
      </ProCard>

      <ProCard title={t('Thông tin sổ Nenkin')} bordered style={{ marginBottom: 16 }}>
        <ProDescriptions column={{ xs: 1, md: 2 }}>
          <ProDescriptions.Item label={t('Mã số lương hưu cơ sở')}>
            {worker?.pensionNumber || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('Họ và tên (Katakana)')}>
            {worker?.nameFurigana || '-'}
          </ProDescriptions.Item>
        </ProDescriptions>
        <div>{t('Ảnh chụp sổ Nenkin (trang đầu)')}</div>
        <ImageUploader readOnly value={worker?.nenkinBookImage} />
      </ProCard>

      <ProCard title={t('Thông tin tài khoản Ngân hàng')} bordered style={{ marginBottom: 16 }}>
        <ProDescriptions column={{ xs: 1, md: 2 }}>
          <ProDescriptions.Item label={t('Quốc gia')}>
            {findLabel(BANK_COUNTRY_OPTIONS, worker?.bankCountry)}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('Tên ngân hàng')}>
            {worker?.bankName || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('Tên chi nhánh')}>
            {worker?.bankBranchName || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('Mã Swift (BIC)')}>
            {worker?.bankSwiftCode || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('Địa chỉ chi nhánh')}>
            {worker?.bankBranchAddress || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('Thành phố/Huyện')}>
            {worker?.bankCity || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('Tên tài khoản')}>
            {worker?.bankAccountName || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('Tên tài khoản (Katakana)')}>
            {worker?.bankAccountNameFurigana || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('Số tài khoản')}>
            {worker?.bankAccountNumber || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('Loại tài khoản')}>
            {worker?.bankAccountType
              ? t(
                  findLabel(
                    master?.bankAccountTypes,
                    String(worker.bankAccountType),
                  ),
                )
              : '-'}
          </ProDescriptions.Item>
        </ProDescriptions>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <div>{t('Giấy xác nhận tài khoản ngân hàng')}</div>
            <ImageUploader readOnly value={worker?.bankImage} />
          </Col>
          <Col xs={24} md={12}>
            <div>{t('Giấy xác nhận tài khoản ngân hàng (trang hai)')}</div>
            <ImageUploader readOnly value={worker?.bankImageBack} />
          </Col>
        </Row>
      </ProCard>

      <ProCard title={t('Thông tin thuế')} bordered style={{ marginBottom: 16 }}>
        <ProDescriptions column={{ xs: 1, md: 3 }}>
          <ProDescriptions.Item label={t('Số tiền được miễn đánh thuế')}>
            {formatYen(worker?.taxDeduct)}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('Số tiền thuế phải nộp')}>
            {formatYen(worker?.taxAmount)}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('Số tiền bảo hiểm hưu trí thực lĩnh')}>
            {formatYen(worker?.netPension)}
          </ProDescriptions.Item>
        </ProDescriptions>
      </ProCard>

      <ProCard
        title={t('Quá trình tham gia chế độ lương hưu chung')}
        bordered
        style={{ marginBottom: 16 }}
      >
        <Table<API.InsuranceHistoryItem>
          size="small"
          rowKey="id"
          pagination={false}
          dataSource={worker?.insuranceHistories || []}
          locale={{ emptyText: t('Không có bản ghi') }}
          columns={[
            { title: t('Tên cơ sở kinh doanh'), dataIndex: 'workPlace' },
            { title: t('Địa chỉ'), dataIndex: 'address' },
            {
              title: t('Làm việc từ ngày'),
              dataIndex: 'fromDate',
              width: 150,
              render: (value) => formatDate(value),
            },
            {
              title: t('Đến ngày'),
              dataIndex: 'toDate',
              width: 150,
              render: (value) => formatDate(value),
            },
          ]}
        />
      </ProCard>

      <ProCard title={t('Thông tin kết quả Nenkin')} bordered>
        <ProDescriptions column={{ xs: 1, md: 2 }}>
          <ProDescriptions.Item label={t('Kết quả Nenkin lần 1')}>
            <Badge
              status={
                worker?.nenkinFirstResult === NENKIN_RESULT.RETURNED
                  ? 'success'
                  : 'default'
              }
              text={`${
                NENKIN_RESULT_LABELS[worker?.nenkinFirstResult ?? NENKIN_RESULT.NOT_YET]
              } ${worker?.resultDate1 ? formatDate(worker.resultDate1) : ''}`}
            />
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('Kết quả Nenkin lần 2')}>
            <Badge
              status={
                worker?.nenkinSecondResult === NENKIN_RESULT.RETURNED
                  ? 'success'
                  : 'default'
              }
              text={`${
                NENKIN_RESULT_LABELS[worker?.nenkinSecondResult ?? NENKIN_RESULT.NOT_YET]
              } ${worker?.resultDate2 ? formatDate(worker.resultDate2) : ''}`}
            />
          </ProDescriptions.Item>
        </ProDescriptions>
      </ProCard>
    </>
  );

  const paperTab = (
    <>
      <PaperTable
        serviceType={SERVICE_TYPE.FIRST}
        procedure={byType(SERVICE_TYPE.FIRST)}
        workerId={workerId}
        canCreate={!!checkAccess.createNenkinService}
      />
      <PaperTable
        serviceType={SERVICE_TYPE.SECOND}
        procedure={byType(SERVICE_TYPE.SECOND)}
        workerId={workerId}
        canCreate={!!checkAccess.createNenkinService}
      />
    </>
  );

  return (
    <PageContainer
      title={worker?.name || t('Chi tiết người lao động')}
      loading={loading}
      onBack={() => history.back()}
      extra={
        checkAccess.updateWorker && (
          <Link to={`/workers/${workerId}/edit`}>
            <Button type="primary" icon={<EditOutlined />}>
              {t('Thay đổi')}
            </Button>
          </Link>
        )
      }
    >
      {missingLabels.length > 0 && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          message={t('Thông tin về người lao động chưa đầy đủ')}
          description={tv('Còn thiếu: {fields}.', {
            fields: missingLabels.map((l) => t(l)).join(', '),
          })}
          action={
            checkAccess.updateWorker && (
              <Space>
                <Link to={`/workers/${workerId}/edit`}>{t('Bổ sung thông tin')}</Link>
              </Space>
            )
          }
        />
      )}

      <ProCard
        tabs={{
          items: [
            { key: 'info', label: t('Thông tin'), children: infoTab },
            { key: 'papers', label: t('Giấy tờ đã làm'), children: paperTab },
          ],
        }}
      />
    </PageContainer>
  );
};

export default WorkerDetail;
