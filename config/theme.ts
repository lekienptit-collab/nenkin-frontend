/**
 * Bang mau va design token dung chung cho toan he thong.
 *
 * - `brand`   : mau thuong hieu, dung lai trong global.less va cac trang co gradient.
 * - `antdTheme`: token cua antd v5 (duoc nap qua `antd.theme` trong config.ts).
 *
 * Luu y: config cua plugin antd duoc serialize sang JSON nen o day chi khai bao
 * du lieu thuan (khong dung ham/algorithm).
 */

export const brand = {
  /** Mau chinh - xanh duong dam, dung cho nut, link, menu dang chon. */
  primary: '#2563eb',
  primaryHover: '#1d4ed8',
  primaryActive: '#1e40af',
  /** Mau phu de tao gradient (tim - indigo) va diem nhan (xanh troi). */
  indigo: '#4f46e5',
  sky: '#38bdf8',
  cyan: '#06b6d4',

  success: '#16a34a',
  warning: '#f59e0b',
  error: '#ef4444',

  /** Mau chu: dam cho tieu de, nhat dan cho phan mo ta. */
  ink: '#0f1c3f',
  text: '#1f2a44',
  textSecondary: '#64748b',

  border: '#e8ecf4',
  bgLayout: '#f4f6fb',
  bgSoft: '#f7f9fd',

  /** Gradient dung lai o logo, nut chinh, banner trang tong quan. */
  gradient: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 52%, #4f46e5 100%)',
  gradientSoft: 'linear-gradient(135deg, #eef4ff 0%, #f5f3ff 100%)',
};

/** Font uu tien tieng Viet, co fallback cho tieng Nhat (katakana tren form). */
export const fontFamily = [
  "'Be Vietnam Pro'",
  "'Inter'",
  '-apple-system',
  'BlinkMacSystemFont',
  "'Segoe UI'",
  'Roboto',
  "'Helvetica Neue'",
  "'Hiragino Sans'",
  "'Hiragino Kaku Gothic ProN'",
  "'Yu Gothic'",
  'Meiryo',
  'Arial',
  'sans-serif',
].join(', ');

export const antdTheme = {
  token: {
    colorPrimary: brand.primary,
    colorInfo: brand.primary,
    colorSuccess: brand.success,
    colorWarning: brand.warning,
    colorError: brand.error,
    colorLink: brand.primary,
    colorLinkHover: brand.primaryHover,

    colorTextBase: brand.text,
    colorTextHeading: brand.ink,
    colorBgLayout: brand.bgLayout,
    colorBorder: '#dfe5f0',
    colorBorderSecondary: brand.border,

    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    borderRadiusXS: 4,

    controlHeight: 36,
    fontSize: 14,
    fontFamily,
    lineHeight: 1.5715,

    boxShadow: '0 6px 20px -8px rgba(15, 28, 63, 0.18)',
    boxShadowSecondary: '0 12px 32px -12px rgba(15, 28, 63, 0.22)',
    boxShadowTertiary: '0 1px 2px rgba(15, 28, 63, 0.04), 0 8px 24px -16px rgba(15, 28, 63, 0.18)',

    wireframe: false,
  },

  components: {
    Layout: {
      headerBg: '#ffffff',
      headerHeight: 56,
      headerPadding: '0 20px',
      bodyBg: brand.bgLayout,
      siderBg: '#ffffff',
      footerBg: 'transparent',
      footerPadding: '16px 24px',
    },
    Menu: {
      itemBorderRadius: 10,
      subMenuItemBorderRadius: 10,
      itemHeight: 42,
      itemMarginInline: 8,
      itemMarginBlock: 4,
      iconMarginInlineEnd: 10,
      itemSelectedBg: 'rgba(37, 99, 235, 0.10)',
      itemSelectedColor: brand.primaryHover,
      itemHoverBg: 'rgba(37, 99, 235, 0.06)',
      itemHoverColor: brand.primary,
      itemColor: '#55637d',
      activeBarWidth: 0,
      activeBarBorderWidth: 0,
      collapsedIconSize: 18,
    },
    Card: {
      borderRadiusLG: 16,
      headerFontSize: 16,
      headerHeight: 54,
      paddingLG: 20,
      colorBorderSecondary: brand.border,
    },
    Table: {
      headerBg: brand.bgSoft,
      headerColor: '#5b6b85',
      headerSplitColor: 'transparent',
      headerBorderRadius: 12,
      rowHoverBg: '#f2f6ff',
      rowSelectedBg: '#eaf1ff',
      rowSelectedHoverBg: '#e0e9ff',
      borderColor: '#eef1f7',
      cellPaddingBlock: 12,
      cellPaddingBlockSM: 10,
      footerBg: 'transparent',
    },
    Button: {
      fontWeight: 500,
      primaryShadow: '0 6px 16px -8px rgba(37, 99, 235, 0.65)',
      dangerShadow: '0 6px 16px -8px rgba(239, 68, 68, 0.55)',
      defaultShadow: '0 1px 2px rgba(15, 28, 63, 0.04)',
    },
    Input: {
      activeShadow: '0 0 0 3px rgba(37, 99, 235, 0.10)',
      paddingBlock: 6,
    },
    InputNumber: {
      activeShadow: '0 0 0 3px rgba(37, 99, 235, 0.10)',
    },
    DatePicker: {
      activeShadow: '0 0 0 3px rgba(37, 99, 235, 0.10)',
    },
    Select: {
      optionSelectedBg: '#eaf1ff',
      optionSelectedFontWeight: 600,
      optionPadding: '7px 12px',
      borderRadiusLG: 12,
    },
    Tag: {
      defaultBg: '#f1f5fb',
      defaultColor: '#4a5a75',
      borderRadiusSM: 6,
    },
    Modal: {
      borderRadiusLG: 16,
      titleFontSize: 17,
      headerBg: '#ffffff',
    },
    Dropdown: {
      borderRadiusLG: 12,
      paddingBlock: 6,
    },
    Tabs: {
      titleFontSize: 14,
      inkBarColor: brand.primary,
      itemSelectedColor: brand.primaryHover,
      itemHoverColor: brand.primary,
    },
    Form: {
      labelColor: '#4a5a75',
      labelFontSize: 13,
      verticalLabelPadding: '0 0 6px',
      itemMarginBottom: 20,
    },
    Descriptions: {
      labelBg: brand.bgSoft,
      titleMarginBottom: 12,
      itemPaddingBottom: 12,
    },
    Statistic: {
      titleFontSize: 13,
      contentFontSize: 26,
    },
    Alert: {
      borderRadiusLG: 12,
      withDescriptionPadding: '16px 18px',
    },
    Message: {
      borderRadiusLG: 12,
    },
    Notification: {
      borderRadiusLG: 14,
    },
    Tooltip: {
      borderRadius: 8,
      colorBgSpotlight: 'rgba(15, 28, 63, 0.92)',
    },
    Segmented: {
      trackBg: '#eef2f9',
      itemSelectedBg: '#ffffff',
      borderRadius: 8,
    },
    Steps: {
      navArrowColor: '#cbd5e1',
    },
    Switch: {
      handleShadow: '0 2px 6px -2px rgba(15, 28, 63, 0.35)',
    },
    Checkbox: {
      borderRadiusSM: 5,
    },
    Progress: {
      defaultColor: brand.primary,
    },
    Avatar: {
      containerSize: 32,
    },
  },
};
