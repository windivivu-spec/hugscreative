# HUGs Creative — đối chiếu 28 mục của brief

Trạng thái: bản mockup tương tác hoàn chỉnh theo yêu cầu mới nhất “mockup trước, bổ sung thông tin thật sau”. Các placeholder/contact/stock được đánh dấu; không xem đây là bản xuất bản hoặc bằng chứng năng lực thật. Bản chạy local là bản tham chiếu chính; không tuyên bố đã tạo native Figma.

| Mục                     | Mockup hiện tại / phần cần bổ sung khi xuất bản                                                                                                                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01 Bối cảnh             | Một đầu mối, mạng lưới chuyên môn tại Việt Nam; không nhận có văn phòng/đội quay Mỹ.                                                                                                                                    |
| 02 Mục tiêu / đối tượng | Hero CTA, brief theo dịch vụ/case study và section riêng cho brand/agency đối tác.                                                                                                                                      |
| 03 Phạm vi              | Đủ 5 dịch vụ; 4 nhóm portfolio theo bản chốt của chủ dự án.                                                                                                                                                             |
| 04 Tiêu chí             | Mô tả 5 dịch vụ và CTA ngay hero. Chưa có user research / thử nghiệm hiểu trong 10 giây.                                                                                                                                |
| 05 Cảm giác             | Giữ font, ảnh và motion đã duyệt; bổ sung reel, preview dịch vụ, collaboration và case study.                                                                                                                           |
| 06 Hệ thống hình ảnh    | Pink #EB2266 + black/white, tokens, font địa phương; đã nâng chữ UI/body và vùng chạm. Quyền font/media chờ xác nhận cho xuất bản.                                                                                      |
| 07 Tham khảo            | Đã đọc các trang chính thức Cuberto, Instrument, Designjoy và Locomotive qua web. Không tuyên bố đã audit trực quan đầy đủ desktop/mobile của họ; không sao chép nội dung/claims.                                       |
| 08 Kiến trúc            | Header, Hero, Reel, Work, Services, Archive, About, Process, Partnership, FAQ, Contact, Footer; trang riêng case study và privacy.                                                                                      |
| 09 Header               | CTA mở form, menu desktop/mobile, anchor và Escape/focus restoration; đã kiểm tra 320px.                                                                                                                                |
| 10 Hero                 | Copy dịch vụ, CTA Start a project / View work; giữ composition đã duyệt, thêm reel cạnh luồng hero.                                                                                                                     |
| 11 Showreel             | Có reel mockup 15 giây từ stock, không tiếng, user-play, controls, poster và nhãn concept. Thay reel thật sau.                                                                                                          |
| 12 Services             | Tên, mô tả và 3 đầu ra cho 5 nhóm; preview có điều khiển; CTA chọn sẵn dịch vụ. Photography ghi cần xác nhận địa điểm.                                                                                                  |
| 13 Selected Work        | Ring, filter, modal và 8 URL case study. Đủ Brief / Role / Deliverables / 3 visual / CTA tương tự, ghi Concept project. Chờ portfolio thật.                                                                             |
| 14 About                | Dùng nguyên biography chủ dự án và giải thích mô hình một đầu mối; không stock giả làm nhân sự.                                                                                                                         |
| 15 Process              | Section riêng với 3 chương theo cuộn, minh họa, progress, nút nhảy bước và reduced-motion fallback.                                                                                                                     |
| 16 FAQ                  | 5 câu, native accordion, keyboard và trạng thái rõ.                                                                                                                                                                     |
| 17 Contact              | Multi-service, company, details, budget USD tự nhập và deadline; consent/privacy; error summary, inline errors, loading, duplicate protection, success chỉ khi API provider xác nhận. Mockup review/download không gửi. |
| 18 Motion               | Hero reveal, reel, floating services, ring, scroll process, service preview, collaboration reveal và controls có phản hồi.                                                                                              |
| 19 Giới hạn             | Không autoplay audio, không chặn intro; marquee có pause; sticky services/process giữ theo yêu cầu chủ dự án mới hơn brief.                                                                                             |
| 20 Reduced motion       | CSS + GSAP fallback, normal document flow cho các chapter, static marquee. Reel chỉ tải/phát sau tương tác. Chưa OS-emulate hoặc thử data-saver trên thiết bị thật.                                                     |
| 21 Responsive           | Kiểm tra document overflow ở 320/375/390/768/1440; menu 320 và case study 320. Đây chưa phải ma trận thiết bị vật lý.                                                                                                   |
| 22 Usability            | Semantic controls/native dialogs, labels, focus, linked error summary, privacy mở tab mới, không cognitive auth. Chưa audit đầy đủ assistive technology/WCAG.                                                           |
| 23 Build/performance    | Build/typecheck/lint và validation/HTTP checks; media lazy-load, reel 1.4 MB preload none, không phát video đồng thời. Chưa đo field CWV/mobile throttle.                                                               |
| 24 Ranh giới            | Local mockup. Endpoint gửi email có sẵn nhưng tắt khi thiếu config; không hosting/CMS/tracking/live send.                                                                                                               |
| 25 Bàn giao             | Source, README, tokens, flow/motion/QA docs, asset inventory, desktop/mobile wireframe SVG có thể import. Không có native Figma Auto Layout artifact.                                                                   |
| 26 Duyệt                | Đã chỉnh qua phản hồi typography/brand/process; còn duyệt mockup cuối. Không tự đặt deadline/ngân sách/số vòng.                                                                                                         |
| 27 Nghiệm thu           | Phạm vi mockup đầy đủ; publication cần thay nội dung thật, quyền sử dụng, liên hệ và xác minh vận hành.                                                                                                                 |
| 28 Đầu vào              | Brand đã chốt. Contact/social/portfolio/reel/photography coverage giữ chỗ theo yêu cầu chủ dự án, bổ sung sau.                                                                                                          |

## Các tệp bàn giao

- `docs/handoff/README.md`: sitemap, visitor flows, motion và cấu hình.
- `docs/handoff/qa.md`: kiểm tra đã chạy và giới hạn.
- `docs/handoff/asset-inventory.json`: nguồn media và quyền còn chờ.
- `docs/handoff/tokens.json`: palette/type/breakpoints.
- `docs/handoff/desktop-wireframe.svg`, `mobile-wireframe.svg`: sơ đồ editable/importable.

## Không đồng nhất mockup với production

Chưa gửi email thật, chưa deploy, chưa có portfolio khách thật, chưa có đo CWV thực địa và chưa có file Figma native. Các mục này không được đánh dấu hoàn thành bằng dữ liệu giả.
