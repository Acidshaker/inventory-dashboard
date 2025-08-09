import { useRef, useState } from "react";
import Table from "../components/shared/Table";
import { Box } from "@mui/material";
import { UserForm } from "../components/users/UserForm";
import { ProductForm } from "../components/products/ProductForm";
import { InventoryForm } from "../components/inventory/InventoryForm";

export const Inventory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tableRef = useRef<{ reloadData: () => void }>(null);
  const [item, setItem] = useState<Record<string, any> | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const openModal = (data?: Record<string, any>) => {
    if (data) {
      setItem(data);
      setIsEdit(true);
    } else {
      setItem(null);
      setIsEdit(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    tableRef.current?.reloadData();
  };

  return (
    <Box
      sx={{
        height: "100%",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ paddingTop: "20px" }}>
        <h3>Inventario</h3>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Table
          ref={tableRef}
          action="inventory"
          title="Inventario"
          isView={false}
          isEdit={true}
          isDelete={false}
          onAddClick={openModal}
        />
      </Box>
      <InventoryForm
        open={isModalOpen}
        handleClose={closeModal}
        data={item}
        isEdit={true}
      />
    </Box>
  );
};
