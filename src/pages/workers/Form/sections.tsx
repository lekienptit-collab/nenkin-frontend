import { t, tv } from '@/utils/t';
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
  <Section id="personal" title={t('Thông tin cá nhân - hộ chiếu')}>
    <Row gutter={16}>
      <Col {...twoCols}>
        <ProFormText
          name="name"
          label={t('Họ và tên')}
          tooltip={t('Viết in hoa không dấu, đúng như trên hộ chiếu')}
          rules={[{ required: true, message: t('Vui lòng nhập họ và tên') }]}
        />
      </Col>
      <Col {...twoCols}>
        <ProFormRadio.Group
          name="gender"
          label={t('Giới tính')}
          options={[
            { label: 'Nam', value: GENDER.MALE },
            { label: t('Nữ'), value: GENDER.FEMALE },
          ]}
        />
      </Col>
      <Col {...twoCols}>
        <ProFormDatePicker
          name="dateOfBirth"
          label={t('Ngày tháng năm sinh')}
          fieldProps={{ format: 'DD/MM/YYYY', style: { width: '100%' } }}
        />
      </Col>
      <Col {...twoCols}>
        <Form.Item name="phoneNumber" label={t('Số điện thoại')}>
          <SegmentedInput
            segments={[4, 4, 4]}
            placeholders={['080', '8045', '0561']}
          />
        </Form.Item>
      </Col>
      <Col {...twoCols}>
        <ProFormText name="country" label={t('Quốc tịch')} />
      </Col>
      <Col {...twoCols}>
        <ProFormDatePicker
          name="leaveJapanDate"
          label={t('Ngày rời Nhật Bản')}
          fieldProps={{ format: 'DD/MM/YYYY', style: { width: '100%' } }}
        />
      </Col>
    </Row>

    <Typography.Title level={5}>{t('Ảnh hộ chiếu')}</Typography.Title>
    <Row gutter={16}>
      <Col xs={24} md={8}>
        <Form.Item name="passportFirstPage" label={t('Trang đầu')}>
          <ImageUploader />
        </Form.Item>
      </Col>
      <Col xs={24} md={8}>
        <Form.Item name="passportSecondPage" label="Trang hai">
          <ImageUploader />
        </Form.Item>
      </Col>
      <Col xs={24} md={8}>
        <Form.Item name="passportStampPage" label={t('Trang có dấu xuất cảnh')}>
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
        text: t('Nhập đủ mã bưu điện dạng 123-4567 để tìm kiếm.'),
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
          text: t('Không tìm thấy địa chỉ, vui lòng nhập tay.'),
        });
        return;
      }

      form.setFieldValue('addressJpPrefectureCode', results[0].prefectureCode);

      if (results.length === 1) {
        form.setFieldValue('addressJpDistrict', results[0].district);
        setLookupMessage({
          type: 'success',
          text: t('Đã tìm thấy địa chỉ, vui lòng nhập phần còn lại bằng tay.'),
        });
        return;
      }

      // Nhiều địa điểm cùng mã bưu điện: để người dùng chọn.
      setDistrictChoices(results.map((r) => r.district));
      form.setFieldValue('addressJpDistrict', results[0].district);
      setLookupMessage({
        type: 'warning',
        text: tv('Có nhiều hơn một địa điểm có mã bưu điện {code}. Vui lòng chọn.', {
        code: postalCode,
      }),
      });
    } catch (error) {
      setLookupMessage({
        type: 'error',
        text: t('Không tra được địa chỉ lúc này, vui lòng nhập tay.'),
      });
    } finally {
      setLookingUp(false);
    }
  };

  return (
    <Section id="address" title={t('Thông tin địa chỉ')}>
      <Typography.Title level={5}>{t('Địa chỉ hiện tại (Việt Nam)')}</Typography.Title>
      <Row gutter={16}>
        <Col {...twoCols}>
          <ProFormSelect
            name="addressVnPrefectureCode"
            label={t('Tỉnh')}
            showSearch
            options={master?.vnProvinces}
          />
        </Col>
        <Col {...twoCols}>
          <ProFormText
            name="addressVnDistrict"
            label={t('Thành phố/Huyện')}
            tooltip={t('Điền riêng tên thành phố hoặc huyện')}
          />
        </Col>
        <Col {...twoCols}>
          <ProFormText name="addressVnPostalCode" label={t('Mã bưu điện')} />
        </Col>
        <Col {...twoCols}>
          <ProFormText
            name="addressVnAddress"
            label={t('Địa chỉ đầy đủ')}
            tooltip={t('Tối đa 100 ký tự')}
            fieldProps={{ maxLength: 100, showCount: true }}
          />
        </Col>
        <Col span={24}>
          <Form.Item
            name="leftProofUrl"
            label={t('Giấy tờ chứng minh đã rời Nhật Bản')}
            tooltip={t('Ví dụ: bản sao giấy chứng nhận xoá hộ khẩu (住民票の除票の写し等). Nếu khi rời Nhật đã nộp thông báo thuyên chuyển tại cơ quan hành chính thành phố cư trú thì không cần đính kèm.')}
          >
            <ImageUploader />
          </Form.Item>
        </Col>
      </Row>

      <Typography.Title level={5}>{t('Địa chỉ cuối cùng ở Nhật')}</Typography.Title>
      <Row gutter={16}>
        <Col {...twoCols}>
          <Form.Item
            label={t('Mã bưu điện')}
            rules={[
              {
                pattern: JP_POSTAL_CODE_PATTERN,
                message: t('Mã bưu điện phải có dạng 123-4567'),
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
                {t('Tìm địa chỉ')}
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
            label={t('Tỉnh/Thành phố')}
            showSearch
            options={master?.jpPrefectures}
          />
        </Col>
        <Col {...twoCols}>
          {districtChoices.length > 0 ? (
            <Form.Item name="addressJpDistrict" label={t('Xã/Phường/Thị trấn')}>
              <Select
                options={districtChoices.map((d) => ({ label: d, value: d }))}
              />
            </Form.Item>
          ) : (
            <ProFormText name="addressJpDistrict" label={t('Xã/Phường/Thị trấn')} />
          )}
        </Col>
        <Col {...twoCols}>
          <ProFormText name="addressJpHouseNumber" label={t('Đường phố/Số nhà')} />
        </Col>
      </Row>
    </Section>
  );
};

// ------------------------------------------------- Thẻ ngoại kiều / sổ Nenkin

export const ResidenceSection: React.FC<SectionProps> = () => (
  <Section id="residence" title={t('Thông tin thẻ ngoại kiều')}>
    <Row gutter={16}>
      <Col span={24}>
        <ProFormText
          name="occupation"
          label={t('Nghề nghiệp ở Nhật Bản')}
          placeholder={t('ví dụ: 特定技能1号')}
        />
      </Col>
      <Col xs={24} md={12}>
        <Form.Item name="residenceCardFrontImage" label={t('Ảnh mặt trước')}>
          <ImageUploader />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item name="residenceCardBackImage" label={t('Ảnh mặt sau')}>
          <ImageUploader />
        </Form.Item>
      </Col>
    </Row>
  </Section>
);

export const NenkinBookSection: React.FC<SectionProps> = () => (
  <Section id="nenkinBook" title={t('Thông tin sổ Nenkin')}>
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <Form.Item
          name="pensionNumber"
          label={t('Mã số lương hưu cơ sở')}
          rules={[
            {
              pattern: PENSION_NUMBER_PATTERN,
              message: t('Mã số phải có dạng 1234-123456'),
            },
          ]}
        >
          <SegmentedInput segments={[4, 6]} placeholders={['1234', '123456']} />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <ProFormText
          name="nameFurigana"
          label={t('Họ và tên người lao động (Katakana)')}
          fieldProps={{ className: 'worker-name-furigana' }}
        />
      </Col>
      <Col xs={24} md={12}>
        <Form.Item name="nenkinBookImage" label={t('Ảnh sổ Nenkin trang đầu')}>
          <ImageUploader />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          name="insuranceLossImage"
          label={EXTRA_DOCUMENT_LABELS.insuranceLossImage}
          tooltip={t('Giấy do công ty cấp khi cắt bảo hiểm. Ảnh này được ghép thành một trang trong bộ hồ sơ Nenkin lần 1.')}
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
    <Section id="bank" title={t('Thông tin tài khoản Ngân hàng')}>
      <Row gutter={16}>
        <Col {...twoCols}>
          <ProFormSelect
            name="bankCountry"
            label={t('Quốc gia')}
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
            label={t('Tên ngân hàng')}
            tooltip={t('Muốn tự điền tên ngân hàng thì chọn "Ngân hàng khác"')}
          >
            <Select
              showSearch
              optionFilterProp="label"
              value={selectValue}
              disabled={!bankCountry}
              placeholder={
                bankCountry ? t('Chọn ngân hàng') : t('Chọn quốc gia trước')
              }
              onChange={handleSelectBank}
              options={[
                ...bankOptions.map((b) => ({ label: b.label, value: b.value })),
                { label: t('Ngân hàng khác'), value: OPTION_OTHERS },
              ]}
            />
          </Form.Item>
        </Col>
        {/* Luôn giữ trong form để submit; hiện ra khi tự nhập tên ngân hàng. */}
        <Col {...twoCols} style={isCustomBank ? undefined : { display: 'none' }}>
          <ProFormText name="bankName" label={t('Tên ngân hàng (tự nhập)')} />
        </Col>
        <Col {...twoCols}>
          <ProFormText name="bankBranchName" label={t('Tên chi nhánh')} />
        </Col>
        <Col {...twoCols}>
          <ProFormText
            name="bankSwiftCode"
            label={t('Mã Swift (BIC)')}
            placeholder={t('ví dụ: VTCBVNVX')}
            tooltip={t('Mã SWIFT (BIC) gồm 8 hoặc 11 ký tự. Nếu nhận tiền vào tổ chức tài chính trong Nhật Bản thì không cần điền.')}
          />
        </Col>
        <Col {...twoCols}>
          <ProFormText
            name="bankBranchAddress"
            label={t('Địa chỉ chi nhánh')}
            tooltip={t('Nếu không có chi nhánh, hãy ghi địa chỉ của trụ sở chính.')}
          />
        </Col>
        <Col {...twoCols}>
          <ProFormText
            name="bankCity"
            label={t('Thành phố/Huyện')}
            extra={
              <Typography.Link onClick={copyCityFromBranch}>
                {t('Sao chép từ địa chỉ chi nhánh')}
              </Typography.Link>
            }
          />
        </Col>
        <Col {...twoCols}>
          <ProFormText
            name="bankAccountName"
            label={t('Tên tài khoản')}
            extra={
              <Typography.Link onClick={copyNameFromWorker}>
                {t('Sao chép từ thông tin cá nhân')}
              </Typography.Link>
            }
          />
        </Col>
        <Col {...twoCols}>
          <ProFormText
            name="bankAccountNameFurigana"
            label={t('Tên tài khoản (Katakana)')}
            tooltip={t('Dùng khi người lao động sử dụng tài khoản ngân hàng ở Nhật Bản')}
          />
        </Col>
        <Col {...twoCols}>
          <ProFormText
            name="bankAccountNumber"
            label={t('Số tài khoản')}
            placeholder={t('ví dụ: 0751000019382')}
          />
        </Col>
        <Col {...twoCols}>
          <ProFormSelect
            name="bankAccountType"
            label={t('Loại tài khoản')}
            options={(master?.bankAccountTypes || []).map((o) => ({
              label: t(o.label),
              value: Number(o.value),
            }))}
            tooltip={t('Dùng khi người lao động quay lại Nhật và tự nhận tiền hoàn thuế: bộ hồ sơ lần 2 khoanh 普通/当座/貯蓄 theo ô này.')}
          />
        </Col>
      </Row>

      <Typography.Title level={5}>{t('Ảnh giấy xác nhận tài khoản')}</Typography.Title>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name="bankImage" label={t('Giấy xác nhận trang một')}>
            <ImageUploader />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="bankImageBack" label={t('Giấy xác nhận trang hai (nếu có)')}>
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
  <Section id="tax" title={t('Thông tin thuế')}>
    <Row gutter={16}>
      <Col xs={24} md={8}>
        {/* Mức miễn thuế là hằng số của Sở Thuế, không cho sửa tay để khỏi
            nhập nhầm — giống hệ thống cũ. */}
        <ProFormDigit
          name="taxDeduct"
          label={t('Số tiền được miễn đánh thuế')}
          fieldProps={{ ...yenProps, readOnly: true }}
          tooltip={t('Mức miễn thuế cố định 1.200.000¥, hệ thống tự điền.')}
        />
      </Col>
      <Col xs={24} md={8}>
        <ProFormDigit
          name="taxAmount"
          label={t('Số tiền thuế phải nộp')}
          fieldProps={yenProps}
        />
      </Col>
      <Col xs={24} md={8}>
        <ProFormDigit
          name="netPension"
          label={t('Số tiền bảo hiểm hưu trí thực lĩnh')}
          fieldProps={yenProps}
        />
      </Col>
    </Row>
  </Section>
);

export const InsuranceSection: React.FC<SectionProps> = () => (
  <Section id="insurance" title={t('Quá trình tham gia chế độ lương hưu chung')}>
    <Alert
      type="info"
      showIcon
      style={{ marginBottom: 16 }}
      message={
        <>
          <div>
            {t(
              'Nếu người lao động từng là thuyền viên, phần "Tên cơ sở kinh doanh" ghi tên chủ sở hữu tàu và tên con tàu.',
            )}
          </div>
          <div>
            {t(
              'Thời gian tham gia bảo hiểm lương hưu quốc dân, chỉ cần ghi địa chỉ nơi người lao động sinh sống.',
            )}
          </div>
        </>
      }
    />
    <ProFormList
      name="insuranceHistories"
      max={MAX_INSURANCE_HISTORY}
      creatorButtonProps={{ creatorButtonText: t('Thêm dòng') }}
      copyIconProps={false}
    >
      <Row gutter={16}>
        <Col xs={24} md={6}>
          <ProFormTextArea
            name="workPlace"
            label={t('Tên cơ sở kinh doanh')}
            fieldProps={{ autoSize: { minRows: 1, maxRows: 3 } }}
          />
        </Col>
        <Col xs={24} md={6}>
          <ProFormTextArea
            name="address"
            label={t('Địa chỉ')}
            fieldProps={{ autoSize: { minRows: 1, maxRows: 3 } }}
          />
        </Col>
        <Col xs={24} md={4}>
          <ProFormDatePicker
            name="fromDate"
            label={t('Làm việc từ ngày')}
            fieldProps={{ format: 'DD/MM/YYYY', style: { width: '100%' } }}
          />
        </Col>
        <Col xs={24} md={4}>
          <ProFormDatePicker
            name="toDate"
            label={t('Đến ngày')}
            fieldProps={{ format: 'DD/MM/YYYY', style: { width: '100%' } }}
          />
        </Col>
        <Col xs={24} md={4}>
          <ProFormSelect
            name="pensionScheme"
            label={t('Chế độ lương hưu')}
            options={PENSION_SCHEME_OPTIONS}
            initialValue={DEFAULT_PENSION_SCHEME}
          />
        </Col>
      </Row>
    </ProFormList>
  </Section>
);

export const ResultSection: React.FC<SectionProps> = () => (
  <Section id="result" title={t('Thông tin kết quả Nenkin')}>
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <ProFormDatePicker
          name="resultDate1"
          label={t('Ngày có kết quả Nenkin lần 1')}
          fieldProps={{ format: 'DD/MM/YYYY', style: { width: '100%' } }}
        />
      </Col>
      <Col xs={24} md={12}>
        <ProFormDatePicker
          name="resultDate2"
          label={t('Ngày có kết quả Nenkin lần 2')}
          fieldProps={{ format: 'DD/MM/YYYY', style: { width: '100%' } }}
        />
      </Col>
    </Row>
  </Section>
);
