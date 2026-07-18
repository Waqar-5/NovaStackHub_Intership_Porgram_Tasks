import { api } from "@/lib/axios";

export const categoryService = {
  list: () => api.get("/categories").then((r) => r.data),
};
