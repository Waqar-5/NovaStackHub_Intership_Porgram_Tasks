import { asyncHandler } from "../utils/asyncHandler.js";
import { apiSuccess, ApiError } from "../utils/apiResponse.js";
import { uploadBufferToCloudinary } from "../services/uploadService.js";

export const updateMyProfile = asyncHandler(async (req, res) => {
  const { name, avatarUrl, studentProfile, teacherProfile } = req.body;

  if (name !== undefined) req.user.name = name;
  if (avatarUrl !== undefined) req.user.avatarUrl = avatarUrl;
  if (studentProfile?.bio !== undefined) req.user.studentProfile.bio = studentProfile.bio;
  if (studentProfile?.phone !== undefined) req.user.studentProfile.phone = studentProfile.phone;
  if (teacherProfile?.bio !== undefined) req.user.teacherProfile.bio = teacherProfile.bio;
  if (teacherProfile?.expertise !== undefined)
    req.user.teacherProfile.expertise = teacherProfile.expertise;

  await req.user.save();

  return apiSuccess(res, { message: "Profile updated.", data: { user: req.user } });
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No image file was provided");
  }

  const result = await uploadBufferToCloudinary(req.file.buffer, {
    folder: "nexus-learn/avatars",
    publicId: req.user._id.toString(),
  });

  req.user.avatarUrl = result.secure_url;
  await req.user.save();

  return apiSuccess(res, { message: "Avatar updated.", data: { user: req.user } });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const list = req.user.studentProfile.wishlist;
  const idx = list.findIndex((id) => id.toString() === courseId);

  if (idx >= 0) list.splice(idx, 1);
  else list.push(courseId);

  await req.user.save();
  return apiSuccess(res, {
    message: idx >= 0 ? "Removed from wishlist." : "Added to wishlist.",
    data: { wishlist: req.user.studentProfile.wishlist },
  });
});

export const toggleBookmark = asyncHandler(async (req, res) => {
  const { lessonId } = req.body;
  const list = req.user.studentProfile.bookmarks;
  const idx = list.findIndex((id) => id.toString() === lessonId);

  if (idx >= 0) list.splice(idx, 1);
  else list.push(lessonId);

  await req.user.save();
  return apiSuccess(res, {
    message: idx >= 0 ? "Bookmark removed." : "Bookmarked.",
    data: { bookmarks: req.user.studentProfile.bookmarks },
  });
});
