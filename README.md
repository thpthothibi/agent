# HTB AI Hub v9.2 — Bản chỉ cần tải lên web

ĐÃ BUILD SẴN. Không cần cài Node.js, không chạy npm, không đặt lệnh build. Bản này dùng chung cho GitHub Pages và Cloudflare Pages.

## 1. Giải nén

Tải ZIP rồi giải nén. Ngay trong thư mục phải thấy `index.html`, `_worker.js`, `assets`, `mascot`, `flow-lab`, `tools` và `downloads`.

Phải tải đủ file và thư mục; index.html phải ở gốc nơi xuất bản. Không đổi tên các file trong assets. Không trộn bản Copy này với bộ mã nguồn v9.2 trước đó.

## 2. Cách nhanh nhất: Cloudflare kéo thả

1. Đăng nhập https://dash.cloudflare.com/.
2. Workers & Pages → Create application → Pages → Drag and drop / Upload assets. Chọn Pages tải file trực tiếp, không chọn Worker viết mã.
3. Đặt tên, ví dụ `htb-agent-hub`.
4. Kéo file ZIP **bản Copy Lên Web này** vào vùng tải lên. Hoặc kéo nội dung thư mục đã giải nén.
5. Kiểm tra index.html nằm ngay cấp đầu, bấm Deploy site.
6. Mở địa chỉ `https://TEN_DU_AN.pages.dev` do Cloudflare trả về.

Không đặt Build command hoặc output directory khi dùng Direct Upload. `_worker.js` đã được biên dịch cho Cloudflare nên không cần thư mục functions.

Direct Upload và Git integration là hai loại project khác nhau: project đã liên kết Git không nhận kéo thả dashboard. Nếu muốn tự cập nhật từ GitHub, làm mục 4 bằng một Pages project Git integration.

## 3. Đưa lên GitHub Pages bằng giao diện

1. Vào https://github.com/new, tạo repository trống, ví dụ `htb-agent-hub`. Chọn Public nếu cần Pages miễn phí ở tài khoản thông thường. Không tải dữ liệu điểm thật lên repository.
2. Trong repository chọn Add file → Upload files; repo trống có thể hiện uploading an existing file.
3. Kéo **toàn bộ file và thư mục bên trong bản giải nén** vào. Không kéo nguyên thư mục cha và không tải nguyên ZIP lên GitHub.
4. Kiểm tra index.html và assets nằm ngay gốc, bấm Commit changes vào main.
5. Nếu chưa thấy `.nojekyll`, chọn Add file → Create new file, đặt tên `.nojekyll`, nhập dòng trống và commit.
6. Settings → Pages → Build and deployment:
   - Source: **Deploy from a branch**.
   - Branch: **main**.
   - Folder: **/(root)**.
   - Bấm Save.
7. Chờ báo thành công, mở link trong Settings → Pages. Thường là `https://TAI_KHOAN.github.io/htb-agent-hub/`.

Không chọn GitHub Actions cho bản Copy này. File dùng đường dẫn tương đối nên dùng được cả tên miền riêng và thư mục repo. Nếu cần, thêm dấu `/` ở cuối địa chỉ repository.

GitHub chỉ chạy phần tĩnh. `_worker.js` không chạy trên GitHub Pages. Excel, cá chép, robot, mô phỏng, xuất file và tải bộ Windows dùng được; kho cloud và API AI máy chủ cần Cloudflare.

## 4. GitHub lưu file → Cloudflare tự cập nhật

Sau khi tải file lên GitHub như mục 3.1–3.4:

1. Cloudflare → tạo Pages project → Connect to Git.
2. Kết nối GitHub, chọn repository và nhánh main.
3. Framework preset: **None**.
4. Build command: **để trống**.
5. Build output directory: **`.`** (một dấu chấm).
6. Root directory: để trống.
7. Save and Deploy.

Lần sau cập nhật file trên GitHub, Cloudflare tự triển khai lại. Bộ mã nguồn v9.2 trước đó dùng npm run build và dist; bản Copy này đã build rồi nên dùng cấu hình trên.

## 5. Bật kho cloud qua dashboard, không cần npm

Chỉ upload file chưa tạo database hay quyền đăng nhập. Phần Excel và lưu trong trình duyệt vẫn chạy trước khi làm bước này.

1. Cloudflare → Storage & databases → D1 → Create database, tên `htb-agent-db`.
2. Mở database → Console. Mở `schema.sql` bằng Notepad, dán nội dung và chạy để tạo bảng. Làm một lần cho database mới. Nếu console chỉ nhận từng câu, chạy riêng từng `CREATE TABLE ...;`.
3. R2 → tạo bucket `htb-agent-files`. Tùy tài khoản có thể cần bật R2/thanh toán; kiểm tra điều kiện trong tài khoản trước.
4. Pages project → Settings → Bindings: thêm D1 binding **DB** chọn database vừa tạo; R2 binding **BUCKET** chọn bucket vừa tạo.
5. Gắn custom domain do bạn sở hữu, ví dụ `agent.ten-truong.edu.vn`.
6. Cloudflare Zero Trust → Access → Applications → Add application → Self-hosted; bảo vệ toàn bộ hostname đó. Allow đúng email cán bộ/giáo viên, có thể dùng OTP qua email. Không đặt Bypass cho dữ liệu nội bộ.
7. Lấy Team domain và Application Audience (AUD). Pages → Settings → Variables and Secrets → Production, thêm:
   - `ACCESS_TEAM_DOMAIN`: `https://TEN_TEAM.cloudflareaccess.com`.
   - `ACCESS_AUD`: AUD thật của ứng dụng Access.
8. Triển khai lại sau khi đổi binding/biến. Direct Upload: Create new deployment, tải lại cùng bộ file. Git integration: Retry deployment hoặc commit cập nhật.
9. Vào tên miền được Access bảo vệ, đăng nhập. `/api/health` cần báo `storageReady=true`, `authConfigured=true`. Tạo hồ sơ thử → Lưu lên cloud → xem phiên bản → lấy về máy.

API xác minh chữ ký JWT, issuer, audience và hạn dùng; thiếu cấu hình thì từ chối đọc/ghi. Mỗi danh tính có kho riêng; chưa có chia sẻ hồ sơ giữa giáo viên/quản trị. Địa chỉ pages.dev không qua Access không được quyền đọc/ghi kho cloud. Dữ liệu cũ từ Site ChatGPT cần sao lưu JSON và khôi phục thủ công, kiểm tra lại trước khi duyệt.

API AI viết quy trình cũng cần Access và khóa API riêng do người dùng nhập. Tài khoản ChatGPT Plus/Gmail không tự cấp API key. Chưa có khóa có thể sao chép prompt/nạp JSON.

## 6. Cài tool Windows để mở Chrome

1. Site → Tool gốc tích hợp → Bộ tích hợp Windows, tải và giải nén.
2. Máy phải cài **Google Chrome**. Chạy `1_CAI_DAT_WINDOWS.bat` trong bộ Windows.
3. Chạy `4_CAU_HINH_DIA_CHI_WEB.bat`:
   - Cloudflare nhập `https://TEN_DU_AN.pages.dev` hoặc tên miền riêng.
   - GitHub nhập `https://TAI_KHOAN.github.io`, không thêm tên repository.
4. Chạy `2_MO_HE_THONG.bat`, lấy mã ghép nối.
5. Site → Kết nối máy tính → nhập mã. Site và Hub phải chạy trên cùng máy. Nếu trình duyệt hỏi quyền truy cập mạng cục bộ, chỉ cấp cho Site của bạn.
6. Thao tác ghi Vietschool vẫn cần xác nhận. Nếu Chrome chưa mở, chạy `3_KIEM_TRA_KHOI_DONG.bat`, xem `workspace/startup-check.txt`.

GitHub/Cloudflare không chạy trực tiếp Python Windows hay mở Chrome trên máy bạn. Cá chép và robot là minh họa trạng thái. Đổi origin phải cấu hình lại, đóng/mở Hub và ghép nối lại.

## 7. Lỗi thường gặp

- 404: index.html nằm nhầm trong thư mục cha; đưa về gốc.
- Trang trắng: tải đủ assets, không đổi tên file, nhấn Ctrl+F5.
- GitHub bỏ qua file bắt đầu `_`: thêm .nojekyll.
- Cloudflare báo quá lớn: từng file phải dưới 25 MiB; bộ Windows đi kèm dưới giới hạn. Không dùng ZIP toàn bộ mã nguồn 41 MB để kéo thả như tài nguyên.
- Kho cloud chưa sẵn sàng: hoàn tất mục 5. GitHub Pages không có API cloud.
- Đổi địa chỉ web: dữ liệu trình duyệt thuộc từng origin; sao lưu JSON trước khi đổi.

Đã kiểm tra build đường dẫn tương đối và Worker giả lập; chưa triển khai lên tài khoản của bạn, chưa thử Chrome trên máy Windows của bạn. Mã nguồn để phát triển nằm trong bộ ZIP toàn bộ GitHub/Cloudflare v9.2 trước đó.

Tài liệu chính thức:
- https://developers.cloudflare.com/pages/get-started/direct-upload/
- https://developers.cloudflare.com/pages/functions/advanced-mode/
- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
