import { t } from '@/utils/t';
import { Alert, Space, Typography } from 'antd';
import React from 'react';

/** Trang tra cứu toàn bộ sở thuế của 国税庁. */
export const NTA_TAX_OFFICE_SEARCH_URL =
  'https://www.nta.go.jp/about/organization/access/map.htm';

/** Tên ngắn lưu trong hồ sơ ("長尾"); hồ sơ cũ có thể lưu cả "真岡税務署". */
export const shortTaxOfficeName = (name?: string) =>
  (name || '').trim().replace(/税務署(長)?$/, '');

/**
 * Các dòng địa chỉ để ghi lên phong bì. Từ 2021 phần lớn sở thuế nhận hồ sơ
 * gửi qua bưu điện tại 業務センター chứ không phải trụ sở; sở nào chưa gom
 * thì gửi thẳng tới địa chỉ của sở.
 */
export const taxOfficeMailingLines = (office: API.TaxOffice): string[] =>
  office.mailing
    ? [
        office.mailing.postalCode ? `〒${office.mailing.postalCode}` : '',
        ...office.mailing.lines,
      ].filter(Boolean)
    : [
        office.location.postalCode ? `〒${office.location.postalCode}` : '',
        office.location.address,
        office.fullName,
      ].filter(Boolean);

type Props = {
  office?: API.TaxOffice;
  searchUrl?: string;
  style?: React.CSSProperties;
};

/** Địa chỉ gửi hồ sơ, khu vực quản lý và link kiểm tra trên trang 国税庁. */
const TaxOfficeInfo: React.FC<Props> = ({
  office,
  searchUrl = NTA_TAX_OFFICE_SEARCH_URL,
  style,
}) => {
  if (!office) {
    return (
      <Typography.Text type="secondary" style={style}>
        {t('Tra cứu sở thuế và địa chỉ gửi hồ sơ tại')}{' '}
        <a href={searchUrl} target="_blank" rel="noreferrer">
          {t('trang của Cục thuế Nhật Bản (NTA)')}
        </a>
      </Typography.Text>
    );
  }

  const lines = taxOfficeMailingLines(office);
  return (
    <Alert
      type="info"
      showIcon
      style={style}
      message={`${t('Địa chỉ gửi hồ sơ qua bưu điện')} — ${office.fullName}（${office.prefecture}）`}
      description={
        <>
          <Typography.Paragraph
            copyable={{ text: lines.join('\n'), tooltips: [t('Sao chép'), t('Đã sao chép')] }}
            style={{ whiteSpace: 'pre-line', marginBottom: 4, fontWeight: 500 }}
          >
            {lines.join('\n')}
          </Typography.Paragraph>
          {!office.mailing && (
            <Typography.Paragraph type="secondary" style={{ marginBottom: 4 }}>
              {t('Sở thuế này nhận hồ sơ gửi qua bưu điện tại chính địa chỉ của sở.')}
            </Typography.Paragraph>
          )}
          {office.mailing?.note && (
            <Typography.Paragraph
              type="secondary"
              style={{ whiteSpace: 'pre-line', marginBottom: 4 }}
            >
              {office.mailing.note}
            </Typography.Paragraph>
          )}
          <Typography.Paragraph type="secondary" style={{ marginBottom: 4 }}>
            {t('Khu vực quản lý')}: {office.jurisdiction.replace(/\n/g, ' ')}
          </Typography.Paragraph>
          <Space wrap size={[16, 0]}>
            {office.url && (
              <a href={office.url} target="_blank" rel="noreferrer">
                {t('Xem trang của sở thuế trên NTA')}
              </a>
            )}
            {(office.detailUrls || []).map((url, i) => (
              <a key={url} href={url} target="_blank" rel="noreferrer">
                {t('Danh sách khu phố thuộc sở')}
                {(office.detailUrls?.length || 0) > 1 ? ` ${i + 1}` : ''}
              </a>
            ))}
            <a href={searchUrl} target="_blank" rel="noreferrer">
              {t('Tra cứu tất cả sở thuế')}
            </a>
          </Space>
        </>
      }
    />
  );
};

export default TaxOfficeInfo;
