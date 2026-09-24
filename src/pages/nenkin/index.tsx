import { t } from '@/utils/t';
import access from '@/access';
import { SERVICE_TYPE, SERVICE_TYPE_LABELS } from '@/constants/nenkin';
import { nenkinPaperTemplates } from '@/services/nenkin/nenkinService';
import { useFetch } from '@/utils/useFetch';
import { ArrowRightOutlined, FilePdfOutlined, LockOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Button, Col, Empty, Row, Skeleton, Tag } from 'antd';
import React from 'react';
import styles from './index.less';

/**
 * Trang giới thiệu 2 lần thủ tục Nenkin và bộ giấy tờ mỗi lần sẽ sinh ra.
 * Bấm "Làm thủ tục" để chọn người lao động và người được uỷ quyền.
 */
const NenkinServicePage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const checkAccess = access(initialState);
  const { data: templates, loading } = useFetch<API.NenkinPaperTemplates>(() =>
    nenkinPaperTemplates(),
  );

  const renderCard = (
    serviceType: API.NenkinServiceType,
    config: { tone: string; note: string; action: string; button?: string },
  ) => {
    const papers = templates?.[String(serviceType)] || [];

    return (
      <div className={styles.card}>
        <div className={`${styles.head} ${config.tone}`}>
          <span className={styles.headBlob} />
          <div className={styles.headNumber}>{serviceType}</div>
          <div className={styles.headText}>
            <div className={styles.headTitle}>{SERVICE_TYPE_LABELS[serviceType]}</div>
            <div className={styles.headDesc}>{config.note}</div>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.listLabel}>
            {t('Bộ giấy tờ sẽ được tạo')}
            {!loading && papers.length > 0 && <span className={styles.count}>{papers.length}</span>}
          </div>

          {loading ? (
            <Skeleton active paragraph={{ rows: 4 }} title={false} />
          ) : papers.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('Chưa có mẫu giấy tờ')} />
          ) : (
            <ul className={styles.papers}>
              {papers.map((item, index) => (
                <li key={item.code}>
                  <span className={styles.paperIndex}>{index + 1}</span>
                  <FilePdfOutlined className={styles.paperIcon} />
                  <span className={styles.paperName}>{t(item.name)}</span>
                  {item.scanned && <Tag color="blue">{t('bản scan')}</Tag>}
                  <code className={styles.paperCode}>{item.code}</code>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.footer}>
          {checkAccess.createNenkinService ? (
            <Button
              type="primary"
              size="large"
              block
              className={config.button}
              onClick={() => history.push(`/nenkin/request/${serviceType}`)}
            >
              {config.action} <ArrowRightOutlined />
            </Button>
          ) : (
            <Button size="large" block disabled icon={<LockOutlined />}>
              {t('Bạn không có quyền tạo hồ sơ')}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <PageContainer
      title={t('Thủ tục Nenkin')}
      content={t('Chọn lần thủ tục cần làm, hệ thống sẽ ghi nhận hồ sơ và sinh bộ giấy tờ tương ứng cho người lao động.')}
    >
      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          {renderCard(SERVICE_TYPE.FIRST, {
            tone: styles.toneBlue,
            note: t('Hoàn tiền bảo hiểm hưu trí sau khi người lao động đã rời Nhật Bản.'),
            action: t('Làm thủ tục lần một'),
          })}
        </Col>
        <Col xs={24} xl={12}>
          {renderCard(SERVICE_TYPE.SECOND, {
            tone: styles.toneViolet,
            button: styles.buttonViolet,
            note: t('Hoàn lại phần thuế đã khấu trừ, làm sau khi đã có kết quả lần một.'),
            action: t('Làm thủ tục lần hai'),
          })}
        </Col>
      </Row>
    </PageContainer>
  );
};

export default NenkinServicePage;
