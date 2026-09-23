import { DefaultFooter } from '@ant-design/pro-components';

const Footer: React.FC<{ className?: string }> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      className={className}
      copyright={`${currentYear} Nenkin · Hệ thống quản trị hồ sơ bảo hiểm hưu trí Nhật Bản`}
      links={[]}
      style={{ background: 'none', paddingBlock: 20, fontSize: 13 }}
    />
  );
};

export default Footer;
