// urlGenerator.js
//
// Chuyển đổi bộ đệm tệp thành định dạng URI dữ liệu để tải lên Cloudinary.
// Trích xuất phần mở rộng tệp từ tên tệp gốc để xác định loại MIME.

import path from "node:path";
import DataUriParser from "datauri/parser.js";

const parser = new DataUriParser();

const urlGenerator = (file) => {
  if (!file) {
    return null;
  }

  // Trích xuất phần mở rộng tệp và chuyển đổi bộ đệm thành URI dữ liệu
  const extension = path.extname(file.originalname).toString();
  return parser.format(extension, file.buffer);
};

export { urlGenerator };
