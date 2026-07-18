import { api } from "@/lib/axios";

export const conversationService = {
  contacts: () => api.get("/conversations/contacts").then((r) => r.data),
  list: () => api.get("/conversations").then((r) => r.data),
  start: (participantId) =>
    api.post("/conversations", { participantId }).then((r) => r.data),
  messages: (conversationId, params) =>
    api.get(`/conversations/${conversationId}/messages`, { params }).then((r) => r.data),
  markRead: (conversationId) =>
    api.post(`/conversations/${conversationId}/read`).then((r) => r.data),
};
