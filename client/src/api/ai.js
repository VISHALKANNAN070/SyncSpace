import api from "./client";

export const brainstormAPI = async (repoId, userInput) => {
  const response = await api.post(`/api/ai/${repoId}/brainstorm`, {
    userInput,
  });

  return response.data;
};