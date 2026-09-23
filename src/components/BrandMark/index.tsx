import React from 'react';

export type BrandMarkProps = {
  /** Canh cua hinh vuong logo (px). */
  size?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Logo chu "N" dat trong khoi bo tron chuyen sac.
 * Dung inline SVG (khong dung file anh) de doi mau/kich thuoc theo tung cho.
 */
const BrandMark: React.FC<BrandMarkProps> = ({ size = 40, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden
  >
    <defs>
      <linearGradient id="nkBrandMark" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60A5FA" />
        <stop offset="0.52" stopColor="#2563EB" />
        <stop offset="1" stopColor="#4F46E5" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="13" fill="url(#nkBrandMark)" />
    <path
      d="M8 34c6-10 12-14 18-12s10 8 14 4"
      stroke="#fff"
      strokeOpacity="0.18"
      strokeWidth="7"
      strokeLinecap="round"
      fill="none"
    />
    <path d="M15 33V13h4.6l9 13V13H33v20h-4.6l-9-13v13H15z" fill="#fff" />
    <rect x="15" y="36" width="18" height="2.6" rx="1.3" fill="#fff" fillOpacity="0.6" />
  </svg>
);

export default BrandMark;
