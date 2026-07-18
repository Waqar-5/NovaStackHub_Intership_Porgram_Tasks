import { api } from "@/lib/axios";

export const quizService = {
  get: (id) => api.get(`/quizzes/${id}`).then((r) => r.data),
  submit: (id, answers, autoSubmitted = false) =>
    api.post(`/quizzes/${id}/attempt`, { answers, autoSubmitted }).then((r) => r.data),
};
