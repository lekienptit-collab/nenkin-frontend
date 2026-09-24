import { t } from '@/utils/t';
import access from '@/access';
import BrandMark from '@/components/BrandMark';
import {
  ArrowRightOutlined,
  FileProtectOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  SolutionOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Button, Card, Col, Row, Space, Steps, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import styles from './index.less';

const { Paragraph, Text, Title } = Typography;

const WEEKDAYS = [
  t('Chủ nhật'),
  t('Thứ hai'),
  t('Thứ ba'),
  t('Thứ tư'),
  t('Thứ năm'),
  t('Thứ sáu'),
  t('Thứ bảy'),
];

const greeting = (hour: number) => {
  if (hour < 11) return t('Chào buổi sáng');
  if (hour < 14) return t('Chào buổi trưa');
  if (hour < 18) return t('Chào buổi chiều');
  return t('Chào buổi tối');
};

type Shortcut = {
  key: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  tone: string;
  visible: boolean;
};

const Welcome: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const checkAccess = access(initialState);

  const now = dayjs();
  const permissionCount = currentUser?.permissions?.includes('all')
    ? t('Toàn quyền')
    : currentUser?.permissions?.length || 0;

  const shortcuts: Shortcut[] = [
    {
      key: 'worker',
      title: t('Người lao động'),
      description: t('Hồ sơ cá nhân, giấy tờ và tình trạng từng lần thủ tục.'),
      icon: <IdcardOutlined />,
      path: '/workers',
      tone: styles.toneBlue,
      visible: !!checkAccess.listWorker,
    },
    {
      key: 'agent',
      title: t('Người đại diện'),
      description: t('Danh sách người được uỷ quyền đứng tên trên hồ sơ.'),
      icon: <SolutionOutlined />,
      path: '/agents',
      tone: styles.toneViolet,
      visible: !!checkAccess.listAgent,
    },
    {
      key: 'nenkin',
      title: t('Thủ tục Nenkin'),
      description: t('Tạo hồ sơ lần 1, lần 2 và tải bộ giấy tờ PDF.'),
      icon: <FileProtectOutlined />,
      path: '/nenkin',
      tone: styles.toneAmber,
      visible: !!checkAccess.listNenkinService,
    },
    {
      key: 'user',
      title: t('Thành viên'),
      description: t('Tài khoản nhân viên đang sử dụng hệ thống.'),
      icon: <TeamOutlined />,
      path: '/users/list',
      tone: styles.toneTeal,
      visible: !!checkAccess.listUser,
    },
    {
      key: 'role',
      title: t('Quản lý quyền'),
      description: t('Nhóm quyền và phân quyền chi tiết theo chức năng.'),
      icon: <SafetyCertificateOutlined />,
      path: '/users/role',
      tone: styles.toneRose,
      visible: !!checkAccess.listRole,
    },
  ].filter((item) => item.visible);

  return (
    <PageContainer title={false}>
      {/* Banner chao mung */}
      <div className={styles.hero}>
        <span className={`${styles.blob} ${styles.blobOne}`} />
        <span className={`${styles.blob} ${styles.blobTwo}`} />

        <div className={styles.heroMain}>
          <div className={styles.heroText}>
            <div className={styles.heroDate}>
              {WEEKDAYS[now.day()]}, {now.format('DD/MM/YYYY')}
            </div>
            <Title level={2} className={styles.heroTitle}>
              {greeting(now.hour())}, {currentUser?.fullname || currentUser?.username || t('bạn')}!
            </Title>
            <Paragraph className={styles.heroDesc}>
              {t('Chúc bạn một ngày làm việc hiệu quả. Chọn một mục bên dưới để bắt đầu xử lý hồ sơ.')}
              Nenkin.
            </Paragraph>

            <Space size={8} wrap>
              {currentUser?.roleName && (
                <Tag className={styles.heroTag}>
                  {t('Vai trò')}: {currentUser.roleName}
                </Tag>
              )}
              <Tag className={styles.heroTag}>
                {t('Số quyền')}: {permissionCount}
              </Tag>
            </Space>
          </div>

          <div className={styles.heroSide}>
            <BrandMark size={72} className={styles.heroMark} />
            {checkAccess.createWorker && (
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                className={styles.heroButton}
                onClick={() => history.push('/workers/create')}
              >
                {t('Thêm người lao động')}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Loi tat toi cac man hinh chinh */}
      {shortcuts.length > 0 && (
        <>
          <div className={styles.sectionTitle}>{t('Lối tắt')}</div>
          <Row gutter={[16, 16]} className={styles.shortcutRow}>
            {shortcuts.map((item) => (
              <Col key={item.key} xs={24} sm={12} lg={8} xxl={6}>
                <Card
                  hoverable
                  className={styles.shortcut}
                  onClick={() => history.push(item.path)}
                >
                  <div className={`${styles.shortcutIcon} ${item.tone}`}>{item.icon}</div>
                  <div className={styles.shortcutBody}>
                    <div className={styles.shortcutTitle}>
                      {item.title}
                      <ArrowRightOutlined className={styles.shortcutArrow} />
                    </div>
                    <div className={styles.shortcutDesc}>{item.description}</div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      <Row gutter={[16, 16]}>
        {/* Quy trinh chuan de nhan vien moi nam duoc thu tu lam viec */}
        <Col xs={24} xl={15}>
          <Card title={t('Quy trình làm hồ sơ')} className={styles.panel}>
            <Steps
              direction="vertical"
              size="small"
              current={-1}
              className={styles.steps}
              items={[
                {
                  title: t('Thêm người lao động'),
                  description: t('Nhập thông tin cá nhân, địa chỉ, ngân hàng và tải ảnh giấy tờ. Có thể dùng AI đọc ảnh để điền nhanh.'),
                },
                {
                  title: t('Thêm người đại diện'),
                  description: t('Người được uỷ quyền đứng tên nhận kết quả và làm việc với cơ quan Nhật Bản.'),
                },
                {
                  title: t('Làm thủ tục Nenkin'),
                  description: t('Chọn thủ tục lần 1 (hoàn bảo hiểm) hoặc lần 2 (hoàn thuế), hệ thống sinh đủ bộ giấy tờ.'),
                },
                {
                  title: t('Tải bộ hồ sơ và cập nhật kết quả'),
                  description: t('Tải PDF từng giấy tờ hoặc cả bộ, sau đó ghi nhận ngày có kết quả cho từng lần.'),
                },
              ]}
            />
          </Card>
        </Col>

        {/* Thong tin tai khoan dang dang nhap */}
        <Col xs={24} xl={9}>
          <Card title={t('Tài khoản của bạn')} className={styles.panel}>
            <div className={styles.account}>
              <div className={styles.accountAvatar}>
                {(currentUser?.fullname || currentUser?.username || 'N').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className={styles.accountName}>
                  {currentUser?.fullname || currentUser?.username || '-'}
                </div>
                <Text type="secondary">@{currentUser?.username || '-'}</Text>
              </div>
            </div>

            <ul className={styles.accountList}>
              <li>
                <MailOutlined />
                <span>{currentUser?.email || t('Chưa có email')}</span>
              </li>
              <li>
                <PhoneOutlined />
                <span>{currentUser?.phone || t('Chưa có số điện thoại')}</span>
              </li>
              <li>
                <SafetyCertificateOutlined />
                <span>{currentUser?.roleName || t('Chưa gán vai trò')}</span>
              </li>
            </ul>

            <Button block onClick={() => history.push('/profile')}>
              {t('Cập nhật thông tin cá nhân')}
            </Button>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Welcome;
