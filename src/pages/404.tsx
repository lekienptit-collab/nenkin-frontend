import { t } from '@/utils/t';
import ExceptionCard from '@/components/ExceptionCard';
import { HomeOutlined, LeftOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { Button, Space } from 'antd';
import React from 'react';

const NoFoundPage: React.FC = () => (
  <ExceptionCard
    code="404"
    title={t('Không tìm thấy trang')}
    description={t('Đường dẫn bạn vừa mở không tồn tại hoặc đã được đổi sang địa chỉ khác.')}
  >
    <Space wrap>
      <Button type="primary" icon={<HomeOutlined />} onClick={() => history.push('/')}>
        {t('Về trang chủ')}
      </Button>
      <Button icon={<LeftOutlined />} onClick={() => history.back()}>
        {t('Quay lại')}
      </Button>
    </Space>
  </ExceptionCard>
);

export default NoFoundPage;
