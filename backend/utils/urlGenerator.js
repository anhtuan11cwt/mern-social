import path from "node:path";
import DataUriParser from "datauri/parser.js";

const parser = new DataUriParser();

const urlGenerator = (file) => {
  if (!file) {
    return null;
  }

  const extension = path.extname(file.originalname).toString();
  return parser.format(extension, file.buffer);
};

export { urlGenerator };
