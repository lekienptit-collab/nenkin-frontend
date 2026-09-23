import BrandMark from '@/components/BrandMark';
import React from 'react';

export type ExceptionCardProps = {
  /** Ma loi hien co lon o giua, vi du 403 / 404. */
  code: string;
  title: string;
  description: string;
  children?: React.ReactNode;
};

/** Khung dung chung cho cac trang bao loi (403, 404). */
const ExceptionCard: React.FC<ExceptionCardProps> = ({
  code,
  title,
  description,
  children,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 220px)',
      padding: '32px 16px',
    }}
  >
    <div
      style={{
        width: '100%',
        maxWidth: 520,
        padding: '44px 40px 40px',
        textAlign: 'center',
        background: '#fff',
        border: '1px solid #e8ecf4',
        borderRadius: 22,
        boxShadow: '0 2px 4px rgba(15,28,63,0.03), 0 24px 56px -34px rgba(15,28,63,0.35)',
      }}
    >
      <BrandMark size={44} style={{ marginBottom: 18 }} />

      <div
        style={{
          fontSize: 72,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: '-0.04em',
          background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 52%, #4f46e5 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {code}
      </div>

      <div
        style={{
          margin: '14px 0 8px',
          color: '#0f1c3f',
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </div>

      <div style={{ marginBottom: 26, color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
        {description}
      </div>

      {children}
    </div>
  </div>
);

export default ExceptionCard;
