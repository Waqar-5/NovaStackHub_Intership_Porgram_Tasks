import User from "../models/User.js";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiSuccess, ApiError } from "../utils/apiResponse.js";
import { notify } from "../services/notificationService.js";

export const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, role, status, search } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  return apiSuccess(res, {
    message: "Users fetched.",
    data: { users },
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  return apiSuccess(res, { message: "User fetched.", data: { user } });
});

function assertNotSelf(req, targetId, action) {
  if (req.user._id.toString() === targetId) {
    throw new ApiError(400, `You can't ${action} your own account`);
  }
}

function assertNotSuperAdmin(target, action) {
  if (env.superAdminEmail && target.email.toLowerCase() === env.superAdminEmail.toLowerCase()) {
    throw new ApiError(403, `The Super Admin account can't be ${action}`);
  }
}

export const suspendUser = asyncHandler(async (req, res) => {
  assertNotSelf(req, req.params.id, "suspend");
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  assertNotSuperAdmin(user, "suspended");

  user.status = "suspended";
  await user.save();
  return apiSuccess(res, { message: "Account suspended.", data: { user } });
});

export const reactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  user.status = "active";
  await user.save();
  return apiSuccess(res, { message: "Account reactivated.", data: { user } });
});

// Approve a pending teacher application.
export const approveTeacher = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, role: "teacher" });
  if (!user) throw new ApiError(404, "Teacher not found");

  user.teacherProfile.approved = true;
  await user.save();

  notify(user._id, {
    type: "system",
    title: "You're approved to teach on Nexus Learn",
    body: "You can now create and publish courses.",
    link: "/teacher/courses",
  }).catch((err) => console.error("[admin] notify failed:", err.message));

  return apiSuccess(res, { message: "Teacher approved.", data: { user } });
});

// Change a user's role. Granting "admin" is only ever done by an existing
// admin acting deliberately here — it is never a side effect of anything
// else, and the Super Admin's own role can't be changed this way.
export const setUserRole = asyncHandler(async (req, res) => {
  assertNotSelf(req, req.params.id, "change the role of");
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  assertNotSuperAdmin(user, "have their role changed");

  user.role = req.body.role;
  await user.save();
  return apiSuccess(res, { message: `Role updated to ${req.body.role}.`, data: { user } });
});

export const deleteUser = asyncHandler(async (req, res) => {
  assertNotSelf(req, req.params.id, "delete");
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  assertNotSuperAdmin(user, "deleted");

  await user.deleteOne();
  return apiSuccess(res, { message: "Account deleted." });
});
