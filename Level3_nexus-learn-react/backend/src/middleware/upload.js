import multer from "multer";
import { ApiError } from "../utils/apiResponse.js";

// Memory storage: files are buffered in RAM and streamed straight to
// Cloudinary by the calling controller (see services/uploadService.js in
// a later phase) — nothing is ever written to local disk.
const storage = multer.memoryStorage();

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "application/pdf",
]);

const MAX_FILE_SIZE_MB = 50;

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME.has(file.mimetype)) {
    return cb(new ApiError(415, `Unsupported file type: ${file.mimetype}`));
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
});
