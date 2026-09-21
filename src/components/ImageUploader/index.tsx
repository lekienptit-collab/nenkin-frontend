import { mediaUrl, uploadImage } from '@/services/nenkin/masterData';
import { DeleteOutlined, FilePdfOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Image, message, Space, Spin, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload';
import React, { useState } from 'react';

export type ImageUploaderProps = {
  /** URL tuong doi do backend tra ve, vi du /media/uploads/202609/abc.jpg */
  value?: string;
  onChange?: (value?: string) => void;
  disabled?: boolean;
  /** Chi hien anh, khong cho sua (dung o man hinh chi tiet). */
  readOnly?: boolean;
  width?: number;
};

const MAX_SIZE_MB = 10;
const ACCEPT = '.jpg,.jpeg,.png,.webp,.heic,.pdf';

const isPdf = (url?: string) => !!url && url.toLowerCase().endsWith('.pdf');

/**
 * O tai anh giay to. Tai file len ngay khi chon roi giu lai URL trong form.
 * Chuc nang OCR cua he thong cu chua lam, nen day chi la tai anh de luu tru.
 */
const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  disabled,
  readOnly,
  width = 160,
}) => {
  const [uploading, setUploading] = useState(false);
  const url = mediaUrl(value);

  const handleUpload = async (file: RcFile) => {
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      message.error(`File tối đa ${MAX_SIZE_MB}MB.`);
      return Upload.LIST_IGNORE;
    }
    setUploading(true);
    try {
      const res = await uploadImage(file);
      onChange?.(res?.url);
      message.success('Đã tải ảnh lên.');
    } catch (error) {
      message.error('Tải ảnh thất bại. Xin thử lại!');
    } finally {
      setUploading(false);
    }
    // Tu quan ly danh sach file nen khong de antd upload lai.
    return Upload.LIST_IGNORE;
  };

  const preview = url ? (
    isPdf(value) ? (
      <a href={url} target="_blank" rel="noreferrer">
        <FilePdfOutlined /> Xem file PDF
      </a>
    ) : (
      <Image src={url} width={width} style={{ borderRadius: 4 }} />
    )
  ) : (
    <span style={{ color: '#bfbfbf' }}>Chưa có ảnh</span>
  );

  if (readOnly) {
    return <>{preview}</>;
  }

  return (
    <Spin spinning={uploading}>
      <Space direction="vertical" size={8}>
        {preview}
        <Space>
          <Upload
            accept={ACCEPT}
            showUploadList={false}
            beforeUpload={handleUpload}
            disabled={disabled || uploading}
          >
            <Button size="small" icon={<UploadOutlined />} disabled={disabled}>
              {value ? 'Đổi file' : 'Tải file'}
            </Button>
          </Upload>
          {value && (
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              disabled={disabled}
              onClick={() => onChange?.(undefined)}
            >
              Xoá
            </Button>
          )}
        </Space>
      </Space>
    </Spin>
  );
};

export default ImageUploader;
