import { api } from "@/lib/axios";

export const certificateService = {
  mine: () => api.get("/certificates/me").then((r) => r.data),
  verify: (certificateId) =>
    api.get(`/certificates/verify/${certificateId}`).then((r) => r.data),
};
