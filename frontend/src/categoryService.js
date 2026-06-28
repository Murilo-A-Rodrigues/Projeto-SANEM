import { apiClient } from "./apiClient";

function unwrap(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.content)) return data.content;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.result)) return data.result;
  return [];
}

export const categoryService = {
  async getAll() {
    const { data } = await apiClient.get("/api/categories");
    return unwrap(data);
  },

  async getById(id) {
    if (!id || id === "0") return null;
    try {
      const { data } = await apiClient.get(`/api/categories/${id}`);
      return data;
    } catch (e) {
      console.warn("categoryService.getById failed", e.message);
      return null;
    }
  },

  async findOrCreateByName(name) {
    if (!name) return null;
    const list = await this.getAll();
    const found = list.find(
      (c) =>
        (c.name || c.description || c.nome || c.descricao || "")
          .toLowerCase() === name.toLowerCase()
    );
    if (found) return found;

    try {
      const { data } = await apiClient.post("/api/categories", { name });
      return data;
    } catch (e) {
      console.warn("categoryService.create failed", e.message);
      return null;
    }
  },
};