# Nenkin Frontend

Base project Ant Design Pro (UmiJS Max + React 18 + antd 5), tách ra từ kiến trúc của
T-connect frontend. Chỉ giữ các màn hình nền: **Đăng nhập, Quản lý thành viên,
Quản lý quyền, Phân quyền**.

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
| Redis | `63791` |

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
├── components/           # Footer, RightContent (avatar + auto refresh token)
├── constants/
│   └── permissionLabel.ts  # nhãn tiếng Việt cho nhóm quyền và permission
├── pages/
│   ├── auth/Login
│   ├── users/            # danh sách + form thêm/sửa thành viên
│   ├── roles/            # danh sách + form quyền
│   ├── roles/PermissionAssign/  # màn hình phân quyền chi tiết
│   ├── account/          # hồ sơ cá nhân + đổi mật khẩu
│   └── Welcome, 403, 404
├── services/nenkin/      # auth.ts, user/, role/ + typings
└── utils/                # token (localStorage), json, error
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
