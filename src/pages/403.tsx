import { t } from '@/utils/t';
import ExceptionCard from '@/components/ExceptionCard';
import { HomeOutlined, LeftOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { Button, Space } from 'antd';
import React from 'react';

const NoAccessPage: React.FC = () => (
  <ExceptionCard
    code="403"
    title={t('Bạn không có quyền vào trang này')}
    description={t('Tài khoản của bạn chưa được cấp quyền cho chức năng này. Liên hệ quản trị viên nếu bạn cần sử dụng.')}
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

export default NoAccessPage;
