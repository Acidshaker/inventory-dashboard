import { useEffect, useRef, useState } from "react";
import Table from "../components/shared/Table";
import { Box } from "@mui/material";
import { UserForm } from "../components/users/UserForm";
import { ProductForm } from "../components/products/ProductForm";
import { inventory } from "../services/endpoints";
import { AlertModal } from "../components/shared/AlertModal";

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tableRef = useRef<{ reloadData: () => void }>(null);
  const [item, setItem] = useState<Record<string, any> | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [alerts, setAlerts] = useState<any>(
    {
      stockOuts: [],
      warnings: []
    }
  );
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

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

  const getAlerts = async () => {
        const res = await inventory.verifyInventory();
        if(res?.data?.data?.stockOuts.length > 0 || res?.data?.data?.warnings.length > 0){
          setAlerts(res.data.data);
          setIsAlertModalOpen(true);
        }
  };

  useEffect(() => {
    getAlerts();
  }, []);

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
        <h3>Productos</h3>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Table
          ref={tableRef}
          action="products"
          title="Productos"
          addLabel="Agregar producto"
          isView={true}
          isEdit={true}
          isDelete={true}
          onAddClick={openModal}
        />
      </Box>
      <ProductForm
        open={isModalOpen}
        handleClose={closeModal}
        item={item}
        isEdit={isEdit}
      />
      <AlertModal open={isAlertModalOpen} handleClose={() => setIsAlertModalOpen(false)} data={alerts} />
    </Box>
  );
};

export default Products;
