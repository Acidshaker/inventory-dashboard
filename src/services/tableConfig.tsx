import { Box } from "@mui/material";
import {
  brands,
  categories,
  inventory,
  materials,
  products,
  users,
} from "./endpoints";
import ImageIcon from "@mui/icons-material/Image";
export interface TableHeader {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableConfigItem {
  getData: (params: Record<string, any>) => Promise<any>;
  headers: TableHeader[];
  deleteFunction?: (id: string) => Promise<any>;
  reactiveFunction?: (id: string) => Promise<any>;
}

export const tableConfig: Record<string, TableConfigItem> = {
  users: {
    getData: (params) => users.getUsers(params),
    headers: [
      {
        key: "firstName",
        label: "Nombre(s)",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
      {
        key: "lastName",
        label: "Apellido(s)",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
      {
        key: "email",
        label: "Correo electrónico",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
      {
        key: "role",
        label: "Rol",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
    ],
    deleteFunction: (id) => users.deleteUser(id),
    reactiveFunction: (id) => users.reactiveUser(id),
  },

  products: {
    getData: (params) => products.getProducts(params),
    headers: [
      {
        key: "productImage",
        label: "Imagen del producto",
        align: "center",
        sortable: false,

        render: (_, row) => (
          <>
            {!row.productImage ? (
              <ImageIcon
                sx={{
                  width: 48,
                  height: 48,
                  objectFit: "cover",
                }}
              />
            ) : (
              <Box
                component="img"
                src={row?.productImage}
                alt="imagen"
                sx={{
                  width: 48,
                  height: 48,
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            )}
          </>
        ),
      },
      {
        key: "sku",
        label: "SKU",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
      {
        key: "name",
        label: "Nombre",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
      {
        key: "brand.name",
        label: "Marca",
        align: "center",
        sortable: true,
        render: (_, row) => row.brand?.name,
      },
      {
        key: "category.name",
        label: "Categoría",
        align: "center",
        sortable: true,
        render: (_, row) => row.category?.name,
      },
    ],
    deleteFunction: (id) => products.deleteProduct(id),
    reactiveFunction: (id) => products.reactivateProduct(id),
  },

  brands: {
    getData: (params) => brands.getBrands(params),
    headers: [
      {
        key: "name",
        label: "Nombre",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
    ],
    deleteFunction: (id) => brands.deleteBrand(id),
    reactiveFunction: (id) => brands.reactivateBrand(id),
  },

  materials: {
    getData: (params) => materials.getMaterials(params),
    headers: [
      {
        key: "name",
        label: "Nombre",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
    ],
    deleteFunction: (id) => materials.deleteMaterial(id),
    reactiveFunction: (id) => materials.reactivateMaterial(id),
  },

  categories: {
    getData: (params) => categories.getCategories(params),
    headers: [
      {
        key: "name",
        label: "Nombre",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
    ],
    deleteFunction: (id) => categories.deleteCategory(id),
    reactiveFunction: (id) => categories.reactivateCategory(id),
  },

  inventory: {
    getData: (params) => inventory.getInventory(params),
    headers: [
      {
        key: "product.productImage",
        label: "Imagen del producto",
        align: "center",
        sortable: false,
        render: (_, row) => (
          <>
            {!row.product.productImage ? (
              <ImageIcon
                sx={{
                  width: 48,
                  height: 48,
                  objectFit: "cover",
                }}
              />
            ) : (
              <Box
                component="img"
                src={row?.product?.productImage}
                alt="imagen"
                sx={{
                  width: 48,
                  height: 48,
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            )}
          </>
        ),
      },
      {
        key: "product.sku",
        label: "SKU",
        align: "center",
        sortable: true,
        render: (_, row) => row.product?.sku,
      },
      {
        key: "product.name",
        label: "Producto",
        align: "center",
        sortable: true,
        render: (_, row) => row.product?.name,
      },
      {
        key: "quantity",
        label: "Stock",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
    ],
  },
};
