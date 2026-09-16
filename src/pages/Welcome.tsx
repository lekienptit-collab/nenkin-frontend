import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import React from 'react';

const { Paragraph, Text } = Typography;

const Welcome: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  return (
    <PageContainer title="Tổng quan">
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Typography.Title level={4}>
          Xin chào, {currentUser?.fullname || currentUser?.username}
        </Typography.Title>
        <Paragraph>
          Đây là base project Nenkin. Các chức năng đã sẵn sàng: đăng nhập, quản lý thành
          viên, quản lý quyền và phân quyền chi tiết.
        </Paragraph>
      </Card>

      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Card bordered={false}>
            <Statistic title="Vai trò" value={currentUser?.roleName || '-'} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false}>
            <Statistic title="Mã vai trò" value={currentUser?.role || '-'} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false}>
            <Statistic
              title="Số quyền được cấp"
              value={
                currentUser?.permissions?.includes('all')
                  ? 'Toàn quyền'
                  : currentUser?.permissions?.length || 0
              }
            />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} title="Tài khoản" style={{ marginTop: 24 }}>
        <Paragraph>
          Email: <Text strong>{currentUser?.email || '-'}</Text>
        </Paragraph>
        <Paragraph>
          Điện thoại: <Text strong>{currentUser?.phone || '-'}</Text>
        </Paragraph>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
