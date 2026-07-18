import cloudinary from "../config/cloudinary.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiResponse.js";

/**
 * Streams a buffer (from multer's memory storage) straight to Cloudinary —
 * nothing ever touches local disk. Returns the secure URL to store on the
 * document (e.g. User.avatarUrl).
 */
export function uploadBufferToCloudinary(buffer, { folder, publicId } = {}) {
  if (!env.cloudinary.cloudName) {
    throw new ApiError(
      503,
      "Image uploads aren't configured yet — add CLOUDINARY_* credentials to .env"
    );
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, public_id: publicId, resource_type: "image", overwrite: true },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}
