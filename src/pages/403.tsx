import { history } from '@umijs/max';
import { Button, Result } from 'antd';
import React from 'react';

const NoAccessPage: React.FC = () => (
  <Result
    status="403"
    title="403"
    subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        Về trang chủ
      </Button>
    }
  />
);

export default NoAccessPage;
