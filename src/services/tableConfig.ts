import api from "./api";
import {
  brands,
  categories,
  inventory,
  materials,
  products,
  users,
} from "./endpoints";

interface TableHeader {
  name: string;
  selector?: (row: any) => any;
  sortable: boolean;
}

interface TableConfigItem {
  getData: (params: Record<string, any>) => Promise<any>;
  headers: TableHeader[];
  deleteFunction?: (id: string) => Promise<any>;
  reactiveFunction?: (id: string) => Promise<any>;
}

export const tableConfig: Record<string, TableConfigItem> = {
  users: {
    getData: (params: Record<string, any>) => users.getUsers(params),
    headers: [
      { name: "Nombre(s)", selector: (row) => row.firstName, sortable: true },
      {
        name: "Apellido(s)",
        selector: (row) => row.lastName,
        sortable: true,
      },
      {
        name: "Correo electrónico",
        selector: (row) => row.email,
        sortable: true,
      },
      {
        name: "Rol",
        selector: (row) => row.role,
        sortable: true,
      },
    ],
    deleteFunction: (id: string) => users.deleteUser(id),
    reactiveFunction: (id: string) => users.reactiveUser(id),
  },
  products: {
    getData: (params: Record<string, any>) => products.getProducts(params),
    headers: [
      { name: "SKU", selector: (row) => row.sku, sortable: true },
      { name: "Nombre", selector: (row) => row.name, sortable: true },
      { name: "Marca", selector: (row) => row.brand.name, sortable: true },
      {
        name: "Categoría",
        selector: (row) => row.category.name,
        sortable: true,
      },
    ],
    deleteFunction: (id: string) => products.deleteProduct(id),
    reactiveFunction: (id: string) => products.reactivateProduct(id),
  },
  brands: {
    getData: (params: Record<string, any>) => brands.getBrands(params),
    headers: [{ name: "Nombre", selector: (row) => row.name, sortable: true }],
    deleteFunction: (id: string) => brands.deleteBrand(id),
    reactiveFunction: (id: string) => brands.reactivateBrand(id),
  },
  materials: {
    getData: (params: Record<string, any>) => materials.getMaterials(params),
    headers: [{ name: "Nombre", selector: (row) => row.name, sortable: true }],
    deleteFunction: (id: string) => materials.deleteMaterial(id),
    reactiveFunction: (id: string) => materials.reactivateMaterial(id),
  },
  categories: {
    getData: (params: Record<string, any>) => categories.getCategories(params),
    headers: [{ name: "Nombre", selector: (row) => row.name, sortable: true }],
    deleteFunction: (id: string) => categories.deleteCategory(id),
    reactiveFunction: (id: string) => categories.reactivateCategory(id),
  },
  inventory: {
    getData: (params: Record<string, any>) => inventory.getInventory(params),
    headers: [
      { name: "Producto", selector: (row) => row.product.name, sortable: true },
      { name: "Stock", selector: (row) => row.quantity, sortable: true },
    ],
  },
};
