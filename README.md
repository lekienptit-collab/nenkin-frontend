# Nenkin Frontend

Giao diện quản trị Ant Design Pro (UmiJS Max + React 18 + antd 5).

Màn hình nền: **Đăng nhập, Quản lý thành viên, Quản lý quyền, Phân quyền**.
Màn hình nghiệp vụ: **Người lao động, Người đại diện, Thủ tục Nenkin**.

## Stack

| Thành phần | Công nghệ |
| --- | --- |
| Framework | UmiJS Max 4 (`@umijs/max`) |
| UI | antd 5 + `@ant-design/pro-components` |
| State | plugin `model` + `initialState` của Umi |
| Phân quyền | plugin `access` (`src/access.ts`) |
| HTTP | plugin `request` (`src/requestErrorConfig.ts`) |

## Chạy dự án

Backend phải chạy trước (xem `../nenkin-backend/README.md`):

```bash
cd ../nenkin-backend
docker compose up -d                  # MySQL + Redis
npm install && npm run start:dev      # -> http://127.0.0.1:3900
```

Sau đó chạy frontend:

```bash
cp .env.example .env     # sửa REACT_APP_API nếu backend chạy port khác
npm install
npm run start:dev
```

Frontend chạy ở `http://127.0.0.1:8000`.
Đăng nhập bằng tài khoản admin do backend seed: `admin` / `Admin@123`.

## Cổng đang dùng

| Dịch vụ | Cổng |
| --- | --- |
| Frontend | `8000` |
| Backend | `3900` |
| MySQL | `33062` |
| Redis | `63792` |

> Backend để `3900` thay vì mặc định `3000` vì trên máy này cổng `3000` và `3001`
> đang bị ứng dụng khác chiếm, `33061` bị `tconnect-backend-mysql` chiếm.
> Khi các cổng đó rảnh, sửa `PORT` trong `../nenkin-backend/.env` và `REACT_APP_API`
> ở đây cho khớp.

## Cấu trúc thư mục

```
config/
├── config.ts             # cấu hình Umi (define, routes, layout, locale, access...)
├── defaultSettings.ts    # theme ProLayout
├── routes.ts             # khai báo route + access key
└── proxy.ts
src/
├── app.tsx               # getInitialState (lấy /me + /me/permissions), layout runtime
├── access.ts             # map permission của backend -> access key dùng trong routes
├── requestErrorConfig.ts # gắn Bearer token, xử lý 401/403
├── components/
│   ├── Footer, RightContent   # avatar + auto refresh token
│   ├── ImageUploader/         # ô tải ảnh giấy tờ + xem trước
│   └── SegmentedInput/        # ô nhập chia phần (mã bưu điện, mã Nenkin, SĐT)
├── constants/
│   ├── permissionLabel.ts     # nhãn tiếng Việt cho nhóm quyền và permission
│   └── nenkin.ts              # enum trạng thái hồ sơ, kết quả, quốc gia ngân hàng
├── pages/
│   ├── auth/Login
│   ├── workers/               # danh sách + Form (thêm/sửa) + Detail (2 tab)
│   ├── agents/                # danh sách + Form + Detail
│   ├── nenkin/                # trang thủ tục + Request (tạo hồ sơ lần 1 / lần 2)
│   ├── users/                 # danh sách + form thêm/sửa thành viên
│   ├── roles/                 # danh sách + form quyền
│   ├── roles/PermissionAssign/  # màn hình phân quyền chi tiết
│   ├── account/               # hồ sơ cá nhân + đổi mật khẩu
│   └── Welcome, 403, 404
├── services/nenkin/      # auth.ts, user/, role/, worker/, agent/,
│                         # nenkinService/, masterData/ + typings
└── utils/                # token (localStorage), json, error, date, useFetch
```

## Cơ chế phân quyền phía frontend

1. Sau khi đăng nhập, `getInitialState` gọi `GET /me` và `GET /me/permissions`,
   lưu vào `initialState.currentUser.permissions`.
2. `src/access.ts` chuyển danh sách permission thành các access key
   (`listUser`, `createRole`, ...). Permission `all` = mọi access key đều `true`.
3. Route dùng access key qua thuộc tính `access` trong `config/routes.ts` —
   không có quyền thì menu tự ẩn và route trả 403.
4. Trong trang, dùng `access(initialState)` để ẩn/hiện nút (Thêm, Sửa, Xoá, Phân quyền).

Màn hình **Phân quyền** (`/users/role/permissions?roleId=...`) đọc nhóm quyền từ
`GET /roles/permissions` nên khi backend thêm permission mới thì frontend tự hiện,
chỉ cần bổ sung nhãn tiếng Việt vào `src/constants/permissionLabel.ts`.

Màn hình này khoá checkbox trong 2 trường hợp:
- Permission mà chính người đang thao tác không có (không cấp được quyền mình không có).
- Permission nằm ngoài phạm vi quyền cha của role đang sửa (`permissionParent`).

## Màn hình nghiệp vụ

### Người lao động (`/workers`)

- Danh sách có bộ lọc giống hệ thống cũ: thông tin người lao động, nhân viên tạo,
  khoảng ngày tạo, trạng thái hồ sơ lần 1/lần 2, đã trả kết quả hay chưa.
- Hai cột hồ sơ Nenkin hiện trạng thái (*Chưa làm* / *Thiếu hoặc chưa đủ thông tin* /
  *Đầy đủ*), kết quả, và link **sửa** mở modal đổi trạng thái đã trả kết quả.
- Form thêm/sửa chia 8 khối, có menu neo bên phải để nhảy nhanh giữa các khối.
- Trang chi tiết có 2 tab: **Thông tin** và **Giấy tờ đã làm**.

### Người đại diện (`/agents`)

Danh sách + form 3 khối (cá nhân / tài khoản ngân hàng / địa chỉ ở Nhật) + trang chi tiết.

### Thủ tục Nenkin (`/nenkin`)

Trang giới thiệu 2 lần thủ tục kèm bộ giấy tờ sẽ sinh ra. Bấm *Làm thủ tục* để chọn
người lao động, người được uỷ quyền, quan hệ và các mốc ngày.

### Đọc giấy tờ bằng AI

Khối **Đọc thông tin từ ảnh giấy tờ** nằm ở đầu form thêm/sửa người lao động
(`src/pages/workers/Form/OcrPanel.tsx`). Tải ảnh hộ chiếu, thẻ ngoại kiều, sổ Nenkin,
giấy xác nhận ngân hàng vào các ô tương ứng rồi bấm *Đọc ảnh đã tải lên*.

AI **chỉ gợi ý, không tự ghi vào form**. Kết quả hiện trong bảng đối chiếu
*đang có trên form* / *AI đọc được*; ô nào đang trống thì tích sẵn, ô nào đã có dữ liệu
thì để trống để người dùng tự quyết định có ghi đè hay không.

Khối này tự ẩn khi backend chưa cấu hình `GROQ_API_KEY` (`GET /ocr/status`).
Đọc đủ 6 ảnh mất khoảng 60-90 giây vì giới hạn tốc độ của Groq — xem
`../nenkin-backend/README.md` mục *Đọc giấy tờ bằng AI*.

Thêm loại giấy tờ đọc được: bổ sung vào `OCR_DOCUMENT_SOURCES` và `OCR_FIELD_LABELS`
trong `src/constants/nenkin.ts` (phải khớp với khai báo phía backend).

### Giấy tờ PDF

Tab *Giấy tờ đã làm* liệt kê từng tờ trong bộ hồ sơ kèm link **Tải PDF**, và nút
**Tải cả bộ hồ sơ** để lấy một file gộp in một lượt. Mẫu nào chưa được cấu hình sẽ hiện
*Chưa có file PDF* thay vì link. Chi tiết ở `../nenkin-backend/README.md` mục
*Sinh file PDF*.

## Vài điểm cần lưu ý khi sửa code

**Không dùng `useRequest` của `@umijs/max` cho API của dự án này.** Nó mặc định trả về
`res.data`, trong khi phần lớn endpoint trả thẳng object ở cấp ngoài cùng. Dùng
`useFetch` (`src/utils/useFetch.ts`) thay thế.

**Ngày tháng.** Ô chọn ngày hiển thị `DD/MM/YYYY` nhưng backend nhận `YYYY-MM-DD`.
Người dùng bấm lịch thì form giữ `dayjs`, gõ tay thì form giữ chuỗi theo định dạng hiển
thị — nên payload luôn phải đi qua `toApiDate()` (`src/utils/date.ts`) trước khi gửi.

## Token

- Lưu ở `localStorage` key `auth_nenkin` (`src/utils/token.ts`).
- `RightContent` kiểm tra mỗi 30 giây, còn dưới 5 phút là hết hạn thì tự gọi
  `POST /token/refresh`.
- Response 401 → xoá token và chuyển về `/auth/login`.

## Biến môi trường

| Biến | Mặc định | Ghi chú |
| --- | --- | --- |
| `REACT_APP_API` | `http://127.0.0.1:3900` | URL backend |
| `REACT_APP_NAME` | `Nenkin` | Đặt `false` để tắt watermark |
| `PORT` | 8000 | Cổng dev server |
