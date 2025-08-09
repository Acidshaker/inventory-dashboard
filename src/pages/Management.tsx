import { Box, Tab, Tabs } from "@mui/material";
import { use, useEffect, useRef, useState } from "react";
import CategoryIcon from "@mui/icons-material/Category";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import PolylineIcon from "@mui/icons-material/Polyline";
import Table from "../components/shared/Table";
import { ManagementForm } from "../components/management/ManagementForm";

export const Management = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tableRef = useRef<{ reloadData: () => void }>(null);
  const [item, setItem] = useState<Record<string, any> | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [config, setConfig] = useState({
    action: "categories",
    title: "Categorías",
    addLabel: "Agregar categoría",
  });

  const changeConfig = () => {
    if (selectedTab === 0) {
      setConfig({
        action: "categories",
        title: "Categorías",
        addLabel: "Agregar categoría",
      });
    } else if (selectedTab === 1) {
      setConfig({
        action: "brands",
        title: "Marcas",
        addLabel: "Agregar marca",
      });
    } else if (selectedTab === 2) {
      setConfig({
        action: "materials",
        title: "Materiales",
        addLabel: "Agregar material",
      });
    }
  };

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

  useEffect(() => {
    changeConfig();
  }, [selectedTab]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
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
      <Tabs
        centered
        sx={{ my: 4 }}
        value={selectedTab}
        onChange={handleChange}
        aria-label="tabs"
      >
        <Tab icon={<CategoryIcon />} label="CATEGORIAS" />
        <Tab icon={<BrandingWatermarkIcon />} label="MARCAS" />
        <Tab icon={<PolylineIcon />} label="MATERIALES" />
      </Tabs>
      <Box sx={{ paddingTop: "20px" }}>
        <h3>{config.title}</h3>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Table
          key={config.action}
          ref={tableRef}
          action={config.action}
          title={config.title}
          addLabel={config.addLabel}
          isView={true}
          isEdit={true}
          isDelete={true}
          onAddClick={openModal}
        />
      </Box>
      <ManagementForm
        key={config.action}
        open={isModalOpen}
        handleClose={closeModal}
        data={item}
        isEdit={isEdit}
        action={config.action}
        title={
          config.title === "Materiales"
            ? config.title.slice(0, -2).toLowerCase()
            : config.title.slice(0, -1).toLowerCase()
        }
      />
    </Box>
  );
};
