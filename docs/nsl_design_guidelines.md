# NSL-Click Design Guidelines

Đây là tài liệu tiêu chuẩn thiết kế (Design Guidelines) cho hệ thống NSL-Click Portal. Bất kỳ sự thay đổi, bổ sung hay phát triển tính năng mới nào trong tương lai cũng **bắt buộc** phải tuân theo các quy chuẩn dưới đây để đảm bảo tính đồng bộ, hiện đại và nhận diện thương hiệu.

---

## 1. Bảng Màu Thương Hiệu (Color Palette)

Hệ thống sử dụng các màu sắc chủ đạo đặc trưng của NSL, tạo cảm giác mạnh mẽ, chuyên nghiệp và có độ tương phản cao:

- **NSL Red (Đỏ)**: `#cc1f1f` - Sử dụng cho các nút bấm hành động phụ, các chi tiết cần làm nổi bật, hoặc thông báo cảnh báo (Archive, Failed).
- **NSL Gold (Vàng Vàng)**: `#f2a900` - Sử dụng cho các đường viền nhấn mạnh, nút Generate, điểm nhấn trong trang cá nhân (Profile).
- **Text Main (Đen Than/Dark Gray)**: `#333333` - Sử dụng cho chữ viết thông thường, nền các nút bấm chức năng chính (Primary Button), viền (Border) của các nút bấm dạng Brutalism.
- **Background (Xám Nhạt/Trắng)**: `#fdfdfd` (Main) và `#f5f5f5` (Panel/Card) - Nền trang luôn sạch sẽ để làm nổi bật nội dung.

> [!TIP]
> Luôn dùng biến CSS có sẵn (VD: `var(--nsl-red)`, `var(--text-main)`) thay vì gõ mã màu cứng (hardcode) trong thẻ style.

---

## 2. Typography (Kiểu chữ)

- **Font Family**: `Montserrat` (Của Google Fonts).
- **Trọng lượng (Weight)**:
  - **Regular (400)**: Chữ nội dung bình thường.
  - **Medium (500) / Semi-bold (600)**: Tiêu đề phụ, nhãn dán (Label).
  - **Extra-bold (800) / Black (900)**: Các tiêu đề chính (Heading 1, 2), tên người dùng, chữ trên nút bấm.
- **Style**: Chữ trên nút bấm và tiêu đề phần lớn đều được viết hoa (`text-transform: uppercase`) để tạo phong cách mạnh mẽ (Brutalism).

---

## 3. Phong Cách Nút Bấm (Buttons) & Brutalism

Hệ thống UI được định hướng theo phong cách **Neobrutalism / Brutalism nhẹ**:
- Tất cả các nút bấm chức năng (Filter, Tabs, Nút Lưu/Xóa) đều sử dụng class: `.btn-nsl-brutal`
- **Quy tắc `.btn-nsl-brutal`**:
  - Có viền đen rõ nét: `border: 2px solid var(--text-main);`
  - Chữ In Hoa (Uppercase), in đậm (Weight 800).
  - Hiệu ứng Hover: Sẽ nhảy lên một chút (translate) và xuất hiện bóng đổ (box-shadow) lệch về một phía để tạo cảm giác 3D cứng cáp.

- **Nút Primary (Hành động chính)**: Dùng class `.btn-nsl-brutal.primary` hoặc thêm `background: var(--text-main); color: #fff;`
- **Nút Nguy hiểm / Cảnh báo (Archive, Revoke, Delete)**: Dùng background hoặc chữ màu Đỏ (`var(--nsl-red)`).

---

## 4. Header & Bộ Điều Khiển (Header Controls)

- **Chuyển Đổi Ngôn Ngữ (Language Switch)** & **Đăng Xuất (Logout)**:
  - Vị trí: Luôn nằm ở **Góc trên cùng, bên phải** của màn hình.
  - Vùng chứa: Có class `.header-controls`.
  - Kiểu dáng `lang-switch`: Background đen trong suốt (`rgba(0,0,0,0.3)`), viền bo tròn pill (`border-radius: 20px`), chữ trắng.
  - Nút Logout: Chữ trắng, viền trắng mỏng (`border: 2px solid #fff`), background trong suốt.
- Thiết kế này phải đồng nhất 100% qua tất cả các trang: **Admin, Partner, Student Profile**.

---

## 5. Bố cục (Layout) và Bảng / Lưới (Table/Grid)

- **Trang Dashboard (Admin / Partner)**:
  - Tiêu đề (`<h2>`) bên trái, bộ lọc (Filters/Search) bám theo cùng hàng hoặc rớt dòng nhưng luôn canh đều đặn.
  - Các Tabs chọn trạng thái (Rank A, B, C...) dùng `.btn-nsl-brutal`, nút nào đang chọn (active) thì phải có nền đen chữ trắng.
- **Card Ứng viên (Grid Card)**:
  - Header của card có màu nền gradient hoặc solid phụ thuộc vào màu của "Trung tâm (Center)" đào tạo.
  - Viền card dày, bo góc nhẹ, có hover nổi bóng lên.

> [!IMPORTANT]
> Khi thêm tính năng mới, **không tự ý sáng tạo kiểu nút bấm hay bảng màu mới**. Hãy tận dụng lại các class CSS trong `public/css/nsl-design-system.css`.
