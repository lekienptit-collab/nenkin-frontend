import ImageUploader from '@/components/ImageUploader';
import SegmentedInput from '@/components/SegmentedInput';
import {
  BANK_COUNTRY_OPTIONS,
  DEFAULT_PENSION_SCHEME,
  EXTRA_DOCUMENT_LABELS,
  GENDER,
  JP_POSTAL_CODE_PATTERN,
  MAX_INSURANCE_HISTORY,
  OPTION_OTHERS,
  PENSION_NUMBER_PATTERN,
  PENSION_SCHEME_OPTIONS,
} from '@/constants/nenkin';
import { lookupJpAddress } from '@/services/nenkin/masterData';
import { SearchOutlined } from '@ant-design/icons';
import {
  ProCard,
  ProFormDatePicker,
  ProFormDigit,
  ProFormList,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import type { FormInstance } from 'antd';
import { Alert, Button, Col, Form, Row, Select, Space, Typography } from 'antd';
import React, { useMemo, useState } from 'react';

export type SectionProps = {
  form: FormInstance;
  master?: API.MasterData;
};

const twoCols = { xs: 24, md: 12 };

/** Khối có tiêu đề + neo để menu điều hướng bên phải nhảy tới. */
const Section: React.FC<{
  id: string;
  title: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}> = ({ id, title, extra, children }) => (
  <ProCard id={id} title={title} extra={extra} bordered style={{ marginBottom: 16 }}>
    {children}
  </ProCard>
);

// ---------------------------------------------------------------- Cá nhân

export const PersonalSection: React.FC<SectionProps> = () => (
  <Section id="personal" title="Thông tin cá nhân - hộ chiếu">
    <Row gutter={16}>
      <Col {...twoCols}>
        <ProFormText
          name="name"
          label="Họ và tên"
          tooltip="Viết in hoa không dấu, đúng như trên hộ chiếu"
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
        />
      </Col>
      <Col {...twoCols}>
        <ProFormRadio.Group
          name="gender"
          label="Giới tính"
          options={[
            { label: 'Nam', value: GENDER.MALE },
            { label: 'Nữ', value: GENDER.FEMALE },
          ]}
        />
      </Col>
      <Col {...twoCols}>
        <ProFormDatePicker
          name="dateOfBirth"
          label="Ngày tháng năm sinh"
          fieldProps={{ format: 'DD/MM/YYYY', style: { width: '100%' } }}
        />
      </Col>
      <Col {...twoCols}>
        <Form.Item name="phoneNumber" label="Số điện thoại">
          <SegmentedInput
            segments={[4, 4, 4]}
            placeholders={['080', '8045', '0561']}
          />
        </Form.Item>
      </Col>
      <Col {...twoCols}>
        <ProFormText name="country" label="Quốc tịch" />
      </Col>
      <Col {...twoCols}>
        <ProFormDatePicker
          name="leaveJapanDate"
          label="Ngày rời Nhật Bản"
          fieldProps={{ format: 'DD/MM/YYYY', style: { width: '100%' } }}
        />
      </Col>
    </Row>

    <Typography.Title level={5}>Ảnh hộ chiếu</Typography.Title>
    <Row gutter={16}>
      <Col xs={24} md={8}>
        <Form.Item name="passportFirstPage" label="Trang đầu">
          <ImageUploader />
        </Form.Item>
      </Col>
      <Col xs={24} md={8}>
        <Form.Item name="passportSecondPage" label="Trang hai">
          <ImageUploader />
        </Form.Item>
      </Col>
      <Col xs={24} md={8}>
        <Form.Item name="passportStampPage" label="Trang có dấu xuất cảnh">
          <ImageUploader />
        </Form.Item>
      </Col>
    </Row>
  </Section>
);

// ---------------------------------------------------------------- Địa chỉ

export const AddressSection: React.FC<SectionProps> = ({ form, master }) => {
  const [lookingUp, setLookingUp] = useState(false);
  const [lookupMessage, setLookupMessage] = useState<{
    type: 'success' | 'warning' | 'error';
    text: string;
  }>();
  const [districtChoices, setDistrictChoices] = useState<string[]>([]);

  const handleLookup = async () => {
    const postalCode = form.getFieldValue('addressJpPostalCode');
    setDistrictChoices([]);
    if (!JP_POSTAL_CODE_PATTERN.test(postalCode || '')) {
      setLookupMessage({
        type: 'error',
        text: 'Nhập đủ mã bưu điện dạng 123-4567 để tìm kiếm.',
      });
      return;
    }

    setLookingUp(true);
    try {
      const res = await lookupJpAddress(postalCode);
      const results = res?.results || [];

      if (results.length === 0) {
        setLookupMessage({
          type: 'warning',
          text: 'Không tìm thấy địa chỉ, vui lòng nhập tay.',
        });
        return;
      }

      form.setFieldValue('addressJpPrefectureCode', results[0].prefectureCode);

      if (results.length === 1) {
        form.setFieldValue('addressJpDistrict', results[0].district);
        setLookupMessage({
          type: 'success',
          text: 'Đã tìm thấy địa chỉ, vui lòng nhập phần còn lại bằng tay.',
        });
        return;
      }

      // Nhiều địa điểm cùng mã bưu điện: để người dùng chọn.
      setDistrictChoices(results.map((r) => r.district));
      form.setFieldValue('addressJpDistrict', results[0].district);
      setLookupMessage({
        type: 'warning',
        text: `Có nhiều hơn một địa điểm có mã bưu điện ${postalCode}. Vui lòng chọn.`,
      });
    } catch (error) {
      setLookupMessage({
        type: 'error',
        text: 'Không tra được địa chỉ lúc này, vui lòng nhập tay.',
      });
    } finally {
      setLookingUp(false);
    }
  };

  return (
    <Section id="address" title="Thông tin địa chỉ">
      <Typography.Title level={5}>Địa chỉ hiện tại (Việt Nam)</Typography.Title>
      <Row gutter={16}>
        <Col {...twoCols}>
          <ProFormSelect
            name="addressVnPrefectureCode"
            label="Tỉnh"
            showSearch
            options={master?.vnProvinces}
          />
        </Col>
        <Col {...twoCols}>
          <ProFormText
            name="addressVnDistrict"
            label="Thành phố/Huyện"
            tooltip="Điền riêng tên thành phố hoặc huyện"
          />
        </Col>
        <Col {...twoCols}>
          <ProFormText name="addressVnPostalCode" label="Mã bưu điện" />
        </Col>
        <Col {...twoCols}>
          <ProFormText
            name="addressVnAddress"
            label="Địa chỉ đầy đủ"
            tooltip="Tối đa 100 ký tự"
            fieldProps={{ maxLength: 100, showCount: true }}
          />
        </Col>
        <Col span={24}>
          <Form.Item
            name="leftProofUrl"
            label="Giấy tờ chứng minh đã rời Nhật Bản"
            tooltip="Ví dụ: bản sao giấy chứng nhận xoá hộ khẩu (住民票の除票の写し等). Nếu khi rời Nhật đã nộp thông báo thuyên chuyển tại cơ quan hành chính thành phố cư trú thì không cần đính kèm."
          >
            <ImageUploader />
          </Form.Item>
        </Col>
      </Row>

      <Typography.Title level={5}>Địa chỉ cuối cùng ở Nhật</Typography.Title>
      <Row gutter={16}>
        <Col {...twoCols}>
          <Form.Item
            label="Mã bưu điện"
            rules={[
              {
                pattern: JP_POSTAL_CODE_PATTERN,
                message: 'Mã bưu điện phải có dạng 123-4567',
              },
            ]}
          >
            <Space align="start">
              <Form.Item name="addressJpPostalCode" noStyle>
                <SegmentedInput segments={[3, 4]} placeholders={['123', '4567']} />
              </Form.Item>
              <Button
                icon={<SearchOutlined />}
                loading={lookingUp}
                onClick={handleLookup}
              >
                Tìm địa chỉ
              </Button>
            </Space>
          </Form.Item>
          {lookupMessage && (
            <Alert
              type={lookupMessage.type}
              message={lookupMessage.text}
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
        </Col>
        <Col {...twoCols}>
          <ProFormSelect
            name="addressJpPrefectureCode"
            label="Tỉnh/Thành phố"
            showSearch
            options={master?.jpPrefectures}
          />
        </Col>
        <Col {...twoCols}>
          {districtChoices.length > 0 ? (
            <Form.Item name="addressJpDistrict" label="Xã/Phường/Thị trấn">
              <Select
                options={districtChoices.map((d) => ({ label: d, value: d }))}
              />
            </Form.Item>
          ) : (
            <ProFormText name="addressJpDistrict" label="Xã/Phường/Thị trấn" />
          )}
        </Col>
        <Col {...twoCols}>
          <ProFormText name="addressJpHouseNumber" label="Đường phố/Số nhà" />
        </Col>
      </Row>
    </Section>
  );
};

// ------------------------------------------------- Thẻ ngoại kiều / sổ Nenkin

export const ResidenceSection: React.FC<SectionProps> = () => (
  <Section id="residence" title="Thông tin thẻ ngoại kiều">
    <Row gutter={16}>
      <Col span={24}>
        <ProFormText
          name="occupation"
          label="Nghề nghiệp ở Nhật Bản"
          placeholder="ví dụ: 特定技能1号"
        />
      </Col>
      <Col xs={24} md={12}>
        <Form.Item name="residenceCardFrontImage" label="Ảnh mặt trước">
          <ImageUploader />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item name="residenceCardBackImage" label="Ảnh mặt sau">
          <ImageUploader />
        </Form.Item>
      </Col>
    </Row>
  </Section>
);

export const NenkinBookSection: React.FC<SectionProps> = () => (
  <Section id="nenkinBook" title="Thông tin sổ Nenkin">
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <Form.Item
          name="pensionNumber"
          label="Mã số lương hưu cơ sở"
          rules={[
            {
              pattern: PENSION_NUMBER_PATTERN,
              message: 'Mã số phải có dạng 1234-123456',
            },
          ]}
        >
          <SegmentedInput segments={[4, 6]} placeholders={['1234', '123456']} />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <ProFormText
          name="nameFurigana"
          label="Họ và tên người lao động (Katakana)"
          fieldProps={{ className: 'worker-name-furigana' }}
        />
      </Col>
      <Col xs={24} md={12}>
        <Form.Item name="nenkinBookImage" label="Ảnh sổ Nenkin trang đầu">
          <ImageUploader />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          name="insuranceLossImage"
          label={EXTRA_DOCUMENT_LABELS.insuranceLossImage}
          tooltip="Giấy do công ty cấp khi cắt bảo hiểm. Ảnh này được ghép thành một trang trong bộ hồ sơ Nenkin lần 1."
        >
          <ImageUploader />
        </Form.Item>
      </Col>
    </Row>
  </Section>
);

// ---------------------------------------------------------------- Ngân hàng

export const BankSection: React.FC<SectionProps> = ({ form, master }) => {
  const bankCountry = Form.useWatch('bankCountry', form);
  const bankName = Form.useWatch('bankName', form);

  const bankOptions = useMemo(
    () => (master?.banks || []).filter((b) => b.country === bankCountry),
    [master, bankCountry],
  );

  // Tên ngân hàng không nằm trong danh sách nghĩa là người dùng đang tự nhập.
  const isCustomBank =
    !!bankName && !bankOptions.some((b) => b.value === bankName);
  const selectValue = isCustomBank ? OPTION_OTHERS : bankName;

  const handleSelectBank = (value: string) => {
    if (value === OPTION_OTHERS) {
      form.setFieldsValue({ bankName: ' ', bankSwiftCode: undefined });
      return;
    }
    const bank = bankOptions.find((b) => b.value === value);
    form.setFieldsValue({
      bankName: value,
      bankSwiftCode: bank?.swiftCode || undefined,
    });
  };

  const copyNameFromWorker = () => {
    form.setFieldsValue({
      bankAccountName: form.getFieldValue('name'),
      bankAccountNameFurigana: form.getFieldValue('nameFurigana'),
    });
  };

  const copyCityFromBranch = () => {
    form.setFieldValue('bankCity', form.getFieldValue('bankBranchAddress'));
  };

  return (
    <Section id="bank" title="Thông tin tài khoản Ngân hàng">
      <Row gutter={16}>
        <Col {...twoCols}>
          <ProFormSelect
            name="bankCountry"
            label="Quốc gia"
            options={BANK_COUNTRY_OPTIONS}
            fieldProps={{
              // Đổi quốc gia thì danh sách ngân hàng đổi theo, xoá lựa chọn cũ.
              onChange: () =>
                form.setFieldsValue({
                  bankName: undefined,
                  bankSwiftCode: undefined,
                }),
            }}
          />
        </Col>
        <Col {...twoCols}>
          <Form.Item
            label="Tên ngân hàng"
            tooltip='Muốn tự điền tên ngân hàng thì chọn "Ngân hàng khác"'
          >
            <Select
              showSearch
              optionFilterProp="label"
              value={selectValue}
              disabled={!bankCountry}
              placeholder={
                bankCountry ? 'Chọn ngân hàng' : 'Chọn quốc gia trước'
              }
              onChange={handleSelectBank}
              options={[
                ...bankOptions.map((b) => ({ label: b.label, value: b.value })),
                { label: 'Ngân hàng khác', value: OPTION_OTHERS },
              ]}
            />
          </Form.Item>
        </Col>
        {/* Luôn giữ trong form để submit; hiện ra khi tự nhập tên ngân hàng. */}
        <Col {...twoCols} style={isCustomBank ? undefined : { display: 'none' }}>
          <ProFormText name="bankName" label="Tên ngân hàng (tự nhập)" />
        </Col>
        <Col {...twoCols}>
          <ProFormText name="bankBranchName" label="Tên chi nhánh" />
        </Col>
        <Col {...twoCols}>
          <ProFormText
            name="bankSwiftCode"
            label="Mã Swift (BIC)"
            placeholder="ví dụ: VTCBVNVX"
            tooltip="Mã SWIFT (BIC) gồm 8 hoặc 11 ký tự. Nếu nhận tiền vào tổ chức tài chính trong Nhật Bản thì không cần điền."
          />
        </Col>
        <Col {...twoCols}>
          <ProFormText
            name="bankBranchAddress"
            label="Địa chỉ chi nhánh"
            tooltip="Nếu không có chi nhánh, hãy ghi địa chỉ của trụ sở chính."
          />
        </Col>
        <Col {...twoCols}>
          <ProFormText
            name="bankCity"
            label="Thành phố/Huyện"
            extra={
              <Typography.Link onClick={copyCityFromBranch}>
                Sao chép từ địa chỉ chi nhánh
              </Typography.Link>
            }
          />
        </Col>
        <Col {...twoCols}>
          <ProFormText
            name="bankAccountName"
            label="Tên tài khoản"
            extra={
              <Typography.Link onClick={copyNameFromWorker}>
                Sao chép từ thông tin cá nhân
              </Typography.Link>
            }
          />
        </Col>
        <Col {...twoCols}>
          <ProFormText
            name="bankAccountNameFurigana"
            label="Tên tài khoản (Katakana)"
            tooltip="Dùng khi người lao động sử dụng tài khoản ngân hàng ở Nhật Bản"
          />
        </Col>
        <Col {...twoCols}>
          <ProFormText
            name="bankAccountNumber"
            label="Số tài khoản"
            placeholder="ví dụ: 0751000019382"
          />
        </Col>
        <Col {...twoCols}>
          <ProFormSelect
            name="bankAccountType"
            label="Loại tài khoản"
            options={(master?.bankAccountTypes || []).map((t) => ({
              label: t.label,
              value: Number(t.value),
            }))}
            tooltip="Dùng khi người lao động quay lại Nhật và tự nhận tiền hoàn thuế: bộ hồ sơ lần 2 khoanh 普通/当座/貯蓄 theo ô này."
          />
        </Col>
      </Row>

      <Typography.Title level={5}>Ảnh giấy xác nhận tài khoản</Typography.Title>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name="bankImage" label="Giấy xác nhận trang một">
            <ImageUploader />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="bankImageBack" label="Giấy xác nhận trang hai (nếu có)">
            <ImageUploader />
          </Form.Item>
        </Col>
      </Row>
    </Section>
  );
};

// ------------------------------------------------------- Thuế / BHXH / kết quả

const yenProps = {
  min: 0,
  precision: 0,
  suffix: '¥',
  style: { width: '100%' },
};

export const TaxSection: React.FC<SectionProps> = () => (
  <Section id="tax" title="Thông tin thuế">
    <Row gutter={16}>
      <Col xs={24} md={8}>
        <ProFormDigit
          name="taxDeduct"
          label="Số tiền được miễn đánh thuế"
          fieldProps={yenProps}
        />
      </Col>
      <Col xs={24} md={8}>
        <ProFormDigit
          name="taxAmount"
          label="Số tiền thuế phải nộp"
          fieldProps={yenProps}
        />
      </Col>
      <Col xs={24} md={8}>
        <ProFormDigit
          name="netPension"
          label="Số tiền bảo hiểm hưu trí thực lĩnh"
          fieldProps={yenProps}
        />
      </Col>
    </Row>
  </Section>
);

export const InsuranceSection: React.FC<SectionProps> = () => (
  <Section id="insurance" title="Quá trình tham gia chế độ lương hưu chung">
    <Alert
      type="info"
      showIcon
      style={{ marginBottom: 16 }}
      message={
        <>
          <div>
            Nếu người lao động từng là thuyền viên, phần &quot;Tên cơ sở kinh
            doanh&quot; ghi tên chủ sở hữu tàu và tên con tàu.
          </div>
          <div>
            Thời gian tham gia bảo hiểm lương hưu quốc dân, chỉ cần ghi địa chỉ
            nơi người lao động sinh sống.
          </div>
        </>
      }
    />
    <ProFormList
      name="insuranceHistories"
      max={MAX_INSURANCE_HISTORY}
      creatorButtonProps={{ creatorButtonText: 'Thêm dòng' }}
      copyIconProps={false}
    >
      <Row gutter={16}>
        <Col xs={24} md={6}>
          <ProFormTextArea
            name="workPlace"
            label="Tên cơ sở kinh doanh"
            fieldProps={{ autoSize: { minRows: 1, maxRows: 3 } }}
          />
        </Col>
        <Col xs={24} md={6}>
          <ProFormTextArea
            name="address"
            label="Địa chỉ"
            fieldProps={{ autoSize: { minRows: 1, maxRows: 3 } }}
          />
        </Col>
        <Col xs={24} md={4}>
          <ProFormDatePicker
            name="fromDate"
            label="Làm việc từ ngày"
            fieldProps={{ format: 'DD/MM/YYYY', style: { width: '100%' } }}
          />
        </Col>
        <Col xs={24} md={4}>
          <ProFormDatePicker
            name="toDate"
            label="Đến ngày"
            fieldProps={{ format: 'DD/MM/YYYY', style: { width: '100%' } }}
          />
        </Col>
        <Col xs={24} md={4}>
          <ProFormSelect
            name="pensionScheme"
            label="Chế độ lương hưu"
            options={PENSION_SCHEME_OPTIONS}
            initialValue={DEFAULT_PENSION_SCHEME}
          />
        </Col>
      </Row>
    </ProFormList>
  </Section>
);

export const ResultSection: React.FC<SectionProps> = () => (
  <Section id="result" title="Thông tin kết quả Nenkin">
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <ProFormDatePicker
          name="resultDate1"
          label="Ngày có kết quả Nenkin lần 1"
          fieldProps={{ format: 'DD/MM/YYYY', style: { width: '100%' } }}
        />
      </Col>
      <Col xs={24} md={12}>
        <ProFormDatePicker
          name="resultDate2"
          label="Ngày có kết quả Nenkin lần 2"
          fieldProps={{ format: 'DD/MM/YYYY', style: { width: '100%' } }}
        />
      </Col>
    </Row>
  </Section>
);
