import { apiClient } from "./apiClient";

function unwrap(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.content)) return data.content;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.result)) return data.result;
  return [];
}

export const sizeService = {
  async getAll() {
    const { data } = await apiClient.get("/api/sizes");
    return unwrap(data);
  },

  async getById(id) {
    if (!id || id === "0") return null;
    try {
      const { data } = await apiClient.get(`/api/sizes/${id}`);
      return data;
    } catch (e) {
      console.warn("sizeService.getById failed", e.message);
      return null;
    }
  },

  async findOrCreateByName(name) {
    if (!name) return null;
    const list = await this.getAll();
    const found = list.find(
      (s) =>
        (s.name || s.description || s.descricao || "")
          .toLowerCase() === name.toLowerCase()
    );
    if (found) return found;

    try {
      const { data } = await apiClient.post("/api/sizes", { name });
      return data;
    } catch (e) {
      console.warn("sizeService.create failed", e.message);
      return null;
    }
  },
};