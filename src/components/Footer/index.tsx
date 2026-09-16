import { DefaultFooter } from '@ant-design/pro-components';

const Footer: React.FC<{ className?: string }> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      className={className}
      copyright={`${currentYear} Nenkin`}
      links={[]}
      style={{ background: 'none' }}
    />
  );
};

export default Footer;
