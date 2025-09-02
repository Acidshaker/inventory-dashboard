import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Container,
  Divider,
  Fade,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Modal,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import WarningIcon from "@mui/icons-material/Warning";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { inventory } from "../../services/endpoints";
import { InventoryForm } from "../inventory/InventoryForm";
import ImageIcon from "@mui/icons-material/Image";

interface props {
  open: boolean;
  handleClose: () => void;
  data?: any;
}

export const AlertModal = ({
  open,
  handleClose,
  data,
}: props) => {
  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };
  const [selectedTab, setSelectedTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [item, setItem] = useState<Record<string, any> | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [inventoryData, setInventoryData] = useState<any>(data);


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

const closeModal = async () => {
  setIsModalOpen(false);
  const res = await inventory.verifyInventory();
  const updatedData = res.data.data;

  setInventoryData(updatedData);

  const noWarnings = updatedData.warnings.length === 0;
  const noStockOuts = updatedData.stockOuts.length === 0;

  if (noWarnings && noStockOuts) {
    handleClose(); // cierra el AlertModal si ya no hay nada que mostrar
  } else {
    // actualiza la pestaña activa según los nuevos datos
    setSelectedTab(noWarnings ? 1 : 0);
  }
};

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const dispatch = useDispatch();

    useEffect(() => {
  if (open && data) {
    setInventoryData(data);
    if (data.warnings.length > 0) {
      setSelectedTab(0);
    } else {
      setSelectedTab(1);
    }
  }
    }, [open, data]);



  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Container maxWidth="md" sx={style}>
          {/* <Typography variant="h5" gutterBottom>
            Atención
          </Typography> */}
          <InventoryForm
            open={isModalOpen}
            handleClose={closeModal}
            data={item}
            isEdit={true}
          />

          <Tabs
            centered
            sx={{ my: 4 }}
            value={selectedTab}
            onChange={handleChange}
            aria-label="tabs"
          >
            <Tab
              icon={<WarningIcon />}
              disabled={inventoryData.warnings.length === 0}
              iconPosition="start"
              label={`Alertas de stock ${
                inventoryData.warnings.length > 0 ? `(${inventoryData.warnings.length})` : ""
              }`}
            />
            <Tab
              icon={<RemoveShoppingCartIcon />}
              disabled={inventoryData.stockOuts.length === 0}
              iconPosition="start"
              label={`Stock agotado ${
                inventoryData.stockOuts.length > 0 ? `(${inventoryData.stockOuts.length})` : ""
              }`}
            />
          </Tabs>

          {selectedTab === 0 && (
            <Grid container>
              <Grid size={{ md: 12, xs: 12 }}>
                <Box
                  sx={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                >
                  <List
                    dense
                    sx={{ width: "100%", bgcolor: "background.paper" }}
                  >
                    {inventoryData.warnings &&
                      inventoryData.warnings.map((inventory: any) => {
                        const labelId = `checkbox-list-secondary-label-${inventory.id}`;
                        return (
                          <ListItem key={inventory.id} disablePadding>
                            <ListItemButton
                              onClick={() => openModal(inventory)}
                            >
                              {inventory.product.productImage ? (
                                <ListItemAvatar>
                                  <Avatar
                                    alt={`imagen ${inventory.product.name}`}
                                    src={inventory.product.productImage}
                                  />
                                </ListItemAvatar>
                              ) : (
                                <ListItemAvatar>
                                  <ImageIcon
                                    sx={{
                                      width: 48,
                                      height: 48,
                                      objectFit: "cover",
                                    }}
                                  />
                                </ListItemAvatar>
                              )}
                              <ListItemText
                                id={labelId}
                                primary={
                                  <Typography variant="body1">
                                    {inventory.product.name}
                                  </Typography>
                                }
                                secondary={
                                  <Typography variant="body2">
                                    {`Stock actual: ${inventory.quantity}`}
                                  </Typography>
                                }
                              />
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                  </List>
                </Box>
              </Grid>
            </Grid>
          )}

          {selectedTab === 1 && (
            <Grid container>
              <Grid size={{ md: 12, xs: 12 }}>
                <Box
                  sx={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                >
                  <List
                    dense
                    sx={{ width: "100%", bgcolor: "background.paper" }}
                  >
                    {inventoryData.stockOuts &&
                      inventoryData.stockOuts.map((inventory: any) => {
                        const labelId = `checkbox-list-secondary-label-${inventory.id}`;
                        return (
                          <ListItem key={inventory.id} disablePadding>
                            <ListItemButton
                              onClick={() => openModal(inventory)}
                            >
                              {inventory.product.productImage ? (
                                <ListItemAvatar>
                                  <Avatar
                                    alt={`imagen ${inventory.product.name}`}
                                    src={inventory.product.productImage}
                                  />
                                </ListItemAvatar>
                              ) : (
                                <ListItemAvatar>
                                  <ImageIcon
                                    sx={{
                                      width: 48,
                                      height: 48,
                                      objectFit: "cover",
                                    }}
                                  />
                                </ListItemAvatar>
                              )}
                              {/* <ListItemAvatar>
                              <Avatar
                                alt={`imagen ${inventory.product.name}`}
                                src={inventory.product.productImage}
                              />
                            </ListItemAvatar> */}
                              <ListItemText
                                id={labelId}
                                primary={
                                  <Typography variant="body1">
                                    {inventory.product.name}
                                  </Typography>
                                }
                                secondary={
                                  <Typography variant="body2">
                                    {`Stock actual: ${inventory.quantity}`}
                                  </Typography>
                                }
                              />
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                  </List>
                </Box>
              </Grid>
            </Grid>
          )}
          <Divider sx={{ my: 2 }} />
          <Grid
            container
            spacing={2}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Grid size={{ md: 6, xs: 12 }}>
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={handleClose}
              >
                Aceptar
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Fade>
    </Modal>
  );
};
