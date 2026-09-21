import access from '@/access';
import { SERVICE_TYPE, SERVICE_TYPE_LABELS } from '@/constants/nenkin';
import { nenkinPaperTemplates } from '@/services/nenkin/nenkinService';
import { FilePdfOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Button, Card, List, Typography } from 'antd';
import React from 'react';
import { useFetch } from '@/utils/useFetch';

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

  const renderCard = (serviceType: API.NenkinServiceType, actionLabel: string) => (
    <Card
      title={SERVICE_TYPE_LABELS[serviceType]}
      style={{ marginBottom: 24 }}
      extra={
        checkAccess.createNenkinService && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => history.push(`/nenkin/request/${serviceType}`)}
          >
            {actionLabel}
          </Button>
        )
      }
    >
      <List
        loading={loading}
        dataSource={templates?.[String(serviceType)] || []}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<FilePdfOutlined style={{ fontSize: 22, color: '#d4380d' }} />}
              title={item.name}
              description={
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {item.code}
                </Typography.Text>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );

  return (
    <PageContainer
      title="Thủ tục Nenkin"
      content="Chọn lần thủ tục cần làm, hệ thống sẽ ghi nhận hồ sơ và bộ giấy tờ tương ứng cho người lao động."
    >
      <div style={{ maxWidth: 840, margin: '0 auto' }}>
        {renderCard(SERVICE_TYPE.FIRST, 'Làm thủ tục lần một')}
        {renderCard(SERVICE_TYPE.SECOND, 'Làm thủ tục lần hai')}
      </div>
    </PageContainer>
  );
};

export default NenkinServicePage;
