import Category from "../models/Category.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiSuccess, ApiError } from "../utils/apiResponse.js";

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  return apiSuccess(res, { message: "Categories fetched.", data: { categories } });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, icon } = req.body;
  const slug = slugify(name);

  const existing = await Category.findOne({ $or: [{ name }, { slug }] });
  if (existing) throw new ApiError(409, "That category already exists");

  const category = await Category.create({ name, slug, icon });
  return apiSuccess(res, { status: 201, message: "Category created.", data: { category } });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, "Category not found");

  await category.deleteOne();
  return apiSuccess(res, { message: "Category deleted." });
});
