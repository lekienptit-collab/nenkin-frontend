import {
  BANK_COUNTRY_OPTIONS,
  GENDER_LABELS,
  OCR_DOCUMENT_SOURCES,
  OCR_ERROR_LABELS,
  OCR_FIELD_LABELS,
} from '@/constants/nenkin';
import { extractWorkerDocuments, ocrStatus } from '@/services/nenkin/ocr';
import { getErrorCode } from '@/utils/error';
import { useFetch } from '@/utils/useFetch';
import { RobotOutlined, ScanOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import type { FormInstance } from 'antd';
import {
  Alert,
  Button,
  Checkbox,
  Empty,
  message,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';

export type OcrPanelProps = {
  form: FormInstance;
  master?: API.MasterData;
};

type Suggestion = {
  field: string;
  label: string;
  current?: string;
  suggested: any;
  suggestedText: string;
};

const ERROR_MESSAGES: Record<string, string> = {
  ...OCR_ERROR_LABELS,
  OCR_NO_DOCUMENT: 'Chưa có ảnh giấy tờ nào để đọc.',
};

/** Đổi giá trị thô thành chữ để người dùng đối chiếu trước khi áp dụng. */
const display = (
  field: string,
  value: any,
  master?: API.MasterData,
): string => {
  if (value === undefined || value === null || value === '') return '';
  if (field === 'gender') return GENDER_LABELS[value as number] ?? String(value);
  if (field === 'bankCountry') {
    return (
      BANK_COUNTRY_OPTIONS.find((c) => c.value === value)?.label ?? String(value)
    );
  }
  if (field === 'addressJpPrefectureCode') {
    return (
      master?.jpPrefectures?.find((p) => p.value === value)?.label ??
      String(value)
    );
  }
  if (field === 'dateOfBirth' || field === 'leaveJapanDate') {
    const d = dayjs(value);
    return d.isValid() ? d.format('DD/MM/YYYY') : String(value);
  }
  return String(value);
};

/**
 * Đọc ảnh giấy tờ đã tải lên bằng AI rồi gợi ý điền vào form.
 *
 * Kết quả AI luôn phải người dùng duyệt trước khi ghi vào form: ô nào đang
 * trống thì tích sẵn, ô nào đã có dữ liệu thì để người dùng tự quyết định có
 * ghi đè hay không.
 */
const OcrPanel: React.FC<OcrPanelProps> = ({ form, master }) => {
  const { data: status } = useFetch<API.OcrStatus>(() => ocrStatus());

  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<API.OcrExtractResult>();
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const suggestions: Suggestion[] = useMemo(() => {
    if (!result) return [];
    return Object.entries(result.fields)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .map(([field, value]) => ({
        field,
        label: OCR_FIELD_LABELS[field] || field,
        current: display(field, form.getFieldValue(field), master),
        suggested: value,
        suggestedText: display(field, value, master),
      }));
    // form không phải state nên chỉ tính lại khi có kết quả mới.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, master]);

  const handleRun = async () => {
    const documents = OCR_DOCUMENT_SOURCES.map((source) => ({
      type: source.type,
      url: form.getFieldValue(source.field) as string,
    })).filter((d) => !!d.url);

    if (documents.length === 0) {
      message.warning('Hãy tải ảnh giấy tờ lên trước, rồi bấm đọc lại.');
      return;
    }

    setRunning(true);
    try {
      const res = await extractWorkerDocuments(documents);
      setResult(res);
      // Mặc định chỉ tích những ô đang trống, tránh ghi đè dữ liệu đã nhập tay.
      setChecked(
        new Set(
          Object.keys(res.fields || {}).filter(
            (field) => !form.getFieldValue(field),
          ),
        ),
      );
    } catch (error) {
      const code = getErrorCode(error);
      message.error(ERROR_MESSAGES[code] || 'Đọc ảnh bị lỗi. Xin thử lại!');
    } finally {
      setRunning(false);
    }
  };

  const handleApply = () => {
    const values = suggestions
      .filter((s) => checked.has(s.field))
      .reduce((acc, s) => ({ ...acc, [s.field]: s.suggested }), {});

    form.setFieldsValue(values);
    message.success(`Đã điền ${Object.keys(values).length} ô từ ảnh giấy tờ.`);
    setResult(undefined);
  };

  const toggle = (field: string) =>
    setChecked((current) => {
      const next = new Set(current);
      if (next.has(field)) next.delete(field);
      else next.add(field);
      return next;
    });

  if (!status?.enabled) {
    return null;
  }

  const failed = result?.results?.filter((r) => !r.success) || [];

  return (
    <>
      <ProCard
        title={
          <Space>
            <RobotOutlined />
            Đọc thông tin từ ảnh giấy tờ
          </Space>
        }
        bordered
        style={{ marginBottom: 16 }}
        extra={
          <Button
            type="primary"
            icon={<ScanOutlined />}
            loading={running}
            onClick={handleRun}
          >
            Đọc ảnh đã tải lên
          </Button>
        }
      >
        <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Tải ảnh hộ chiếu, thẻ ngoại kiều, sổ Nenkin, giấy xác nhận ngân hàng vào
          các ô bên dưới rồi bấm <strong>Đọc ảnh đã tải lên</strong>. Hệ thống chỉ{' '}
          <strong>gợi ý</strong> — bạn xem lại và chọn ô nào muốn điền trước khi lưu.
        </Typography.Paragraph>
      </ProCard>

      <Modal
        open={!!result}
        title="Kết quả đọc từ ảnh giấy tờ"
        width={820}
        okText={`Điền ${checked.size} ô đã chọn`}
        okButtonProps={{ disabled: checked.size === 0 }}
        cancelText="Bỏ qua"
        onOk={handleApply}
        onCancel={() => setResult(undefined)}
        destroyOnClose
      >
        {failed.length > 0 && (
          <Alert
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
            message="Có ảnh chưa đọc được"
            description={
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {failed.map((f) => (
                  <li key={f.type}>
                    {f.label}:{' '}
                    {OCR_ERROR_LABELS[f.errorCode || ''] || 'Không đọc được'}
                  </li>
                ))}
              </ul>
            }
          />
        )}

        {suggestions.length === 0 ? (
          <Empty description="Không đọc được thông tin nào từ ảnh" />
        ) : (
          <Table<Suggestion>
            size="small"
            rowKey="field"
            pagination={false}
            dataSource={suggestions}
            columns={[
              {
                title: '',
                width: 44,
                render: (_, record) => (
                  <Checkbox
                    checked={checked.has(record.field)}
                    onChange={() => toggle(record.field)}
                  />
                ),
              },
              { title: 'Thông tin', dataIndex: 'label', width: 240 },
              {
                title: 'Đang có trên form',
                dataIndex: 'current',
                render: (value) =>
                  value || <Typography.Text type="secondary">(trống)</Typography.Text>,
              },
              {
                title: 'AI đọc được',
                dataIndex: 'suggestedText',
                render: (value, record) => (
                  <Space>
                    <strong>{value}</strong>
                    {record.current && record.current !== value && (
                      <Tag color="warning">ghi đè</Tag>
                    )}
                  </Space>
                ),
              },
            ]}
          />
        )}
      </Modal>
    </>
  );
};

export default OcrPanel;
