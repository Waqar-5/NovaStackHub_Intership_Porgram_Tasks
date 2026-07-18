export const ROLE_HOME = {
  student: "/dashboard",
  teacher: "/teacher/dashboard",
  admin: "/admin/dashboard",
};

export function roleHomePath(role) {
  return ROLE_HOME[role] || "/";
}
