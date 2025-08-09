import api from "./api";

export const auth = {
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  register: (data: { email: string; password: string }) =>
    api.post("/register", data),
  logout: () => api.post("/logout"),
  refreshToken: () => api.post("/refresh"),
};

export const items = {
  getAll: () => api.get("/items"),
  getById: (id: string) => api.get(`/items/${id}`),
  create: (data: any) => api.post("/items", data),
  update: (id: string, data: any) => api.put(`/items/${id}`, data),
  delete: (id: string) => api.delete(`/items/${id}`),
};

// puedes seguir agregando módulos:
export const users = {
  getUsers: (params: Record<string, any>) => api.get("/users", { params }),
  createUser: (data: any) => api.post("/users", data),
  getProfile: () => api.get("/user/profile"),
  updateUser: (id: string, data: any) => api.patch(`/users/${id}`, data),
  updateProfile: (data: any) => api.put("/user/profile", data),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
  reactiveUser: (id: string) => api.post(`/users/${id}/reactivate`),
};

export const products = {
  getProducts: (params: Record<string, any>) =>
    api.get("/products", { params }),
  createProduct: (data: any) => api.post("/products", data),
  updateProduct: (id: string, data: any) => api.patch(`/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
  reactivateProduct: (id: string) => api.post(`/products/${id}/reactivate`),
};

export const brands = {
  getBrands: (params: Record<string, any>) => api.get("/brands", { params }),
  createBrand: (data: any) => api.post("/brands", data),
  updateBrand: (id: string, data: any) => api.patch(`/brands/${id}`, data),
  deleteBrand: (id: string) => api.delete(`/brands/${id}`),
  reactivateBrand: (id: string) => api.post(`/brands/${id}/reactivate`),
};

export const categories = {
  getCategories: (params: Record<string, any>) =>
    api.get("/categories", { params }),
  createCategory: (data: any) => api.post("/categories", data),
  updateCategory: (id: string, data: any) =>
    api.patch(`/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/categories/${id}`),
  reactivateCategory: (id: string) => api.post(`/categories/${id}/reactivate`),
};

export const materials = {
  getMaterials: (params: Record<string, any>) =>
    api.get("/materials", { params }),
  createMaterial: (data: any) => api.post("/materials", data),
  updateMaterial: (id: string, data: any) =>
    api.patch(`/materials/${id}`, data),
  deleteMaterial: (id: string) => api.delete(`/materials/${id}`),
  reactivateMaterial: (id: string) => api.post(`/materials/${id}/reactivate`),
};

export const inventory = {
  getInventory: (params: Record<string, any>) =>
    api.get("/inventory", { params }),
  createInventory: (data: any) => api.post("/inventory", data),
  updateInventory: (id: string, data: any) =>
    api.patch(`/inventory/${id}`, data),
  deleteInventory: (id: string) => api.delete(`/inventory/${id}`),
};
