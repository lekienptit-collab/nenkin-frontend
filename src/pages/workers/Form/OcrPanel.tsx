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
  Form,
  message,
  Modal,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useRef, useState } from 'react';

export type OcrPanelProps = {
  form: FormInstance;
  master?: API.MasterData;
  /** Hồ sơ đang sửa, để biết ảnh nào vốn đã có sẵn từ trước. */
  worker?: API.WorkerListItem;
  /** Đang sửa hồ sơ cũ (true) hay thêm mới (false). */
  isUpdate?: boolean;
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
 * Đọc ảnh giấy tờ bằng AI rồi điền vào form.
 *
 * Tải ảnh mới lên là hệ thống tự đọc ngay: ô nào đang trống thì điền luôn, ô
 * nào đã có dữ liệu khác thì hỏi lại — không ghi đè âm thầm lên thông tin nhân
 * viên đã sửa tay.
 */
const OcrPanel: React.FC<OcrPanelProps> = ({
  form,
  master,
  worker,
  isUpdate,
}) => {
  const { data: status } = useFetch<API.OcrStatus>(() => ocrStatus());

  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<API.OcrExtractResult>();
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [autoRead, setAutoRead] = useState(true);
  /** Bảng đối chiếu mở ra vì có ô lệch, hay vì người dùng bấm đọc lại. */
  const [onlyConflicts, setOnlyConflicts] = useState(false);

  // Theo dõi các ô ảnh để biết ảnh nào vừa được thay.
  const values = Form.useWatch([], form);
  const seenImages = useRef<Record<string, string | undefined>>({});
  const autoReadRef = useRef(autoRead);
  autoReadRef.current = autoRead;

  /**
   * Ảnh đã có sẵn trong hồ sơ cũ coi như đã đọc rồi: mở hồ sơ ra sửa thì
   * không đọc lại, chỉ ảnh mới tải lên mới kích hoạt đọc tự động.
   */
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current) return;
    // Hồ sơ cũ thì phải chờ tải xong mới biết ảnh nào đã có.
    if (isUpdate && !worker) return;
    OCR_DOCUMENT_SOURCES.forEach((source) => {
      seenImages.current[source.field] = (worker as any)?.[source.field];
    });
    seeded.current = true;
  }, [worker, isUpdate]);

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

  /** Gọi API đọc ảnh; `auto` = do vừa tải ảnh lên chứ không phải người dùng bấm. */
  const runOcr = async (
    documents: API.OcrDocumentInput[],
    auto = false,
  ): Promise<API.OcrExtractResult | undefined> => {
    if (documents.length === 0) {
      if (!auto) {
        message.warning('Hãy tải ảnh giấy tờ lên trước, rồi bấm đọc lại.');
      }
      return undefined;
    }
    setRunning(true);
    try {
      return await extractWorkerDocuments(documents);
    } catch (error) {
      const code = getErrorCode(error);
      message.error(ERROR_MESSAGES[code] || 'Đọc ảnh bị lỗi. Xin thử lại!');
      return undefined;
    } finally {
      setRunning(false);
    }
  };

  const handleRun = async () => {
    const documents = OCR_DOCUMENT_SOURCES.map((source) => ({
      type: source.type,
      url: form.getFieldValue(source.field) as string,
    })).filter((d) => !!d.url);

    const res = await runOcr(documents);
    if (!res) return;
    setOnlyConflicts(false);
    setResult(res);
    // Mặc định chỉ tích những ô đang trống, tránh ghi đè dữ liệu đã nhập tay.
    setChecked(
      new Set(
        Object.keys(res.fields || {}).filter(
          (field) => !form.getFieldValue(field),
        ),
      ),
    );
  };

  /**
   * Tự đọc khi có ảnh mới: điền ngay các ô đang trống, còn ô đã có dữ liệu
   * khác thì gom lại và mở bảng đối chiếu để người dùng quyết định.
   */
  useEffect(() => {
    if (!status?.enabled || !autoReadRef.current || !seeded.current) {
      return;
    }

    const changed = OCR_DOCUMENT_SOURCES.filter((source) => {
      const url = form.getFieldValue(source.field) as string | undefined;
      // Ô đang trống thì giữ nguyên dấu vết cũ: lúc form chưa nạp xong dữ
      // liệu, mọi ô đều trống — xoá dấu vết ở đây sẽ khiến ảnh cũ của hồ sơ
      // bị coi là ảnh mới và đọc lại oan.
      if (!url) return false;
      const wasNew = seenImages.current[source.field] !== url;
      seenImages.current[source.field] = url;
      return wasNew;
    });
    if (changed.length === 0) {
      return;
    }

    let cancelled = false;
    (async () => {
      const res = await runOcr(
        changed.map((source) => ({
          type: source.type,
          url: form.getFieldValue(source.field) as string,
        })),
        true,
      );
      if (!res || cancelled) return;

      const entries = Object.entries(res.fields || {}).filter(
        ([, v]) => v !== undefined && v !== null && v !== '',
      );
      const empty = entries.filter(([field]) => !form.getFieldValue(field));
      const conflicting = entries.filter(([field, v]) => {
        const current = form.getFieldValue(field);
        return current && String(current) !== String(v);
      });

      if (empty.length > 0) {
        form.setFieldsValue(Object.fromEntries(empty));
        message.success(
          `Đã đọc ${changed.map((c) => c.label).join(', ')} và điền ${empty.length} ô.`,
        );
      }
      if (conflicting.length > 0) {
        // Có ô đã nhập tay mà AI đọc ra khác -> hỏi lại thay vì ghi đè.
        setOnlyConflicts(true);
        setResult({ ...res, fields: Object.fromEntries(conflicting) });
        setChecked(new Set());
      } else if (empty.length === 0) {
        message.info('Ảnh mới không có thông tin nào khác với hồ sơ hiện tại.');
      }
    })();

    return () => {
      cancelled = true;
    };
    // Chỉ chạy lại khi giá trị các ô trên form đổi.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, status?.enabled]);

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
          <Space>
            <Switch
              checked={autoRead}
              onChange={setAutoRead}
              checkedChildren="Tự đọc"
              unCheckedChildren="Tắt"
            />
            <Button
              type="primary"
              icon={<ScanOutlined />}
              loading={running}
              onClick={handleRun}
            >
              Đọc lại tất cả ảnh
            </Button>
          </Space>
        }
      >
        <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Tải ảnh hộ chiếu, thẻ ngoại kiều, sổ Nenkin, giấy xác nhận ngân hàng vào
          các ô bên dưới — hệ thống <strong>tự đọc ngay</strong> và điền các ô còn
          trống. Ô nào bạn đã nhập tay mà ảnh đọc ra khác thì sẽ hỏi lại chứ không
          tự ghi đè.
        </Typography.Paragraph>
      </ProCard>

      <Modal
        open={!!result}
        title={
          onlyConflicts
            ? 'Thông tin trên ảnh khác với hồ sơ hiện tại'
            : 'Kết quả đọc từ ảnh giấy tờ'
        }
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

        {onlyConflicts && (
          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
            message="Các ô dưới đây đã có dữ liệu trên hồ sơ. Tích ô nào bạn muốn thay bằng thông tin đọc từ ảnh mới."
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
