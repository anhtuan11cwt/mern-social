import multer from "multer";

const storage = multer.memoryStorage();

const uploadFile = multer({
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  storage,
});

export { uploadFile };
