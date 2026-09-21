import { Input, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

export type SegmentedInputProps = {
  /** So ky tu toi da cua tung o, vi du [3, 4] cho ma buu dien 123-4567. */
  segments: number[];
  /** Ky tu noi giua cac o khi ghep thanh gia tri cuoi cung. */
  separator?: string;
  /** Chi cho nhap chu so. */
  numericOnly?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  placeholders?: string[];
  disabled?: boolean;
};

/** Chuyen ky tu so full-width (１２３) ve half-width (123). */
const toHalfWidth = (text: string) =>
  text.replace(/[！-～]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0),
  );

const split = (value: string | undefined, count: number, separator: string) => {
  const parts = (value || '').split(separator);
  return Array.from({ length: count }, (_, i) => parts[i] || '');
};

/**
 * O nhap chia thanh nhieu phan nhu tren form goc (ma buu dien, ma so luong huu,
 * so dien thoai). Gia tri tra ve la chuoi da noi bang `separator`, va chi noi
 * khi tat ca cac o deu co noi dung - de trong 1 o thi coi nhu chua nhap.
 */
const SegmentedInput: React.FC<SegmentedInputProps> = ({
  segments,
  separator = '-',
  numericOnly = true,
  value,
  onChange,
  placeholders,
  disabled,
}) => {
  const [parts, setParts] = useState<string[]>(() =>
    split(value, segments.length, separator),
  );
  /**
   * Gia tri gan nhat o nay tu phat ra. Khi moi go duoc 1 o thi gia tri phat ra
   * la chuoi rong, neu dong bo nguoc lai tu `value` se xoa mat chu dang go.
   */
  const lastEmitted = useRef<string | undefined>(value);

  useEffect(() => {
    if (value === lastEmitted.current) {
      return;
    }
    lastEmitted.current = value;
    setParts(split(value, segments.length, separator));
  }, [value, separator, segments.length]);

  const handleChange = (index: number, raw: string) => {
    let text = toHalfWidth(raw);
    if (numericOnly) {
      text = text.replace(/[^0-9]/g, '');
    }
    text = text.slice(0, segments[index]);

    const next = [...parts];
    next[index] = text;
    setParts(next);

    // Chi ghep lai khi da nhap du moi o; thieu 1 o coi nhu chua nhap.
    const joined = next.every((p) => p) ? next.join(separator) : '';
    lastEmitted.current = joined;
    onChange?.(joined);
  };

  return (
    <Space.Compact style={{ display: 'flex', alignItems: 'center' }}>
      {segments.map((length, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span style={{ padding: '0 6px', color: '#bfbfbf' }}>{separator}</span>
          )}
          <Input
            style={{ width: `${Math.max(length * 14 + 24, 60)}px` }}
            maxLength={length}
            value={parts[index]}
            disabled={disabled}
            placeholder={placeholders?.[index]}
            onChange={(e) => handleChange(index, e.target.value)}
          />
        </React.Fragment>
      ))}
    </Space.Compact>
  );
};

export default SegmentedInput;
