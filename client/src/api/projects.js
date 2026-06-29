import api from "./client";

export const fetchNotes = async (id) => {
  const response = await api.get(`/api/note/${id}`);
  return response.data;
};

export const createNote = async (id, title, content) => {
  const response = await api.post(`/api/note/${id}`, {
    title,
    content,
  });
  return response.data;
};

export const deleteNote = async (id, noteId) => {
  await api.delete(`/api/note/${id}/${noteId}`);
};

export const fetchTasks = async (id) => {
  const response = await api.get(`/api/task/${id}`);
  return response.data;
};

export const createTask = async (id, task) => {
  const response = await api.post(`/api/task/${id}`, { task });
  return response.data;
};

export const toggleTask = async (id, taskId) => {
  const response = await api.patch(`/api/task/${id}/${taskId}`);
  return response.data;
};

export const deleteTask = async (id, taskId) => {
  await api.delete(`/api/task/${id}/${taskId}`);
};

export const saveRepo = async (repoData) => {
  const response = await api.post("/api/repo", {
    repoId: repoData.id,
    name: repoData.name,
    url: repoData.html_url,
  });
  return response.data;
};