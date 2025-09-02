import {
  Backdrop,
  Box,
  Button,
  Container,
  Divider,
  Fade,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../store/uiSlice";
import { inventory, users } from "../../services/endpoints";
import ImageIcon from "@mui/icons-material/Image";
import { toast } from "react-toastify";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import TuneIcon from "@mui/icons-material/Tune";

interface props {
  open: boolean;
  handleClose: () => void;
  data?: any;
  isEdit?: boolean;
}

export const InventoryForm = ({
  open,
  handleClose,
  data,
  isEdit = false,
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

  const [product, setProduct] = useState<any>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [adjustValue, setAdjustValue] = useState<number>(0);
  const [adjustType, setAdjustType] = useState<"sumar" | "restar">("sumar");

  const schema = yup.object({
    // quantity not less than 0
    quantity: yup
      .number()
      .typeError("Debe ser un número válido")
      .min(0, "No se permiten números negativos")
      .test("max-2-decimals", "Máximo 2 decimales permitidos", (value) => {
        if (value === undefined || value === null) return true;
        return /^\d+(\.\d{1,2})?$/.test(value.toString());
      })
      .required("Cantidad requerida"),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<{
    quantity: number;
  }>({
    resolver: yupResolver(schema),
    mode: "onChange", // Valida al escribir
    reValidateMode: "onBlur",
  });

  const dispatch = useDispatch();

  const onSubmit = async (body: any) => {
    dispatch(showLoading());
    try {
      const InventoryData = {
        quantity: body.quantity,
      };
      const res = await inventory.updateInventory(data.id, InventoryData);
      console.log(res.data);
      toast.success(
        `Registro de inventario ${isEdit ? "actualizado" : "creado"} con éxito`
      );
      handleClose();
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleCancel = () => {
    reset();
    handleClose();
  };

  useEffect(() => {
    if (open && isEdit && data) {
      reset({
        quantity: data.quantity,
      });
      setProduct(data.product);
    } else if (open && !isEdit) {
      reset();
    }
  }, [open, isEdit, data, reset]);

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
          <Typography variant="h5" gutterBottom>
            Editar registro de inventario
          </Typography>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            {/* Imagen del producto */}
            {product?.productImage ? (
              <Box
                component="img"
                src={product?.productImage}
                alt={product?.name}
                sx={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 2,
                  border: "1px solid #ddd",
                }}
              />
            ) : (
              <ImageIcon
                sx={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 2,
                  border: "1px solid #ddd",
                }}
              />
            )}
            {/* <Box
              component="img"
              src={product?.productImage}
              alt={product?.name}
              sx={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: 2,
                border: "1px solid #ddd",
              }}
            /> */}

            {/* Nombre del producto */}
            <Typography variant="h6" fontWeight="bold">
              {product?.name}
            </Typography>

            {/* Stock actual */}
            <Typography variant="body2" color="text.secondary">
              Stock actual: <strong>{data?.quantity}</strong> cajas (
              {data?.quantity * data?.product?.equivalence || 1} rollos)
            </Typography>

            {/* Formulario de ajuste */}
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                  >
                    <Box>
                      <TextField
                        {...field}
                        label="Ajuste de stock"
                        sx={{
                          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                            {
                              display: "none",
                            },
                          "& input[type=number]": {
                            MozAppearance: "textfield",
                          },
                          input: {
                            textAlign: "center",
                          },
                        }}
                        type="number"
                        error={!!errors.quantity}
                        helperText={errors.quantity?.message || " "}
                        InputProps={{
                          style: {
                            color: "#000",
                          },

                          startAdornment: (
                            <InputAdornment position="start">
                              <IconButton
                                onClick={() =>
                                  field.onChange(Math.max(0, field.value - 1))
                                }
                              >
                                <RemoveIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => field.onChange(field.value + 1)}
                              >
                                <AddIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <IconButton
                      onClick={(e) => setMenuAnchor(e.currentTarget)}
                      color="primary"
                      size="small"
                      sx={{
                        alignSelf: "flex-start",
                        mt: 0.3,
                      }}
                    >
                      <Tooltip title="Agregar o quitar cantidad">
                        <TuneIcon />
                      </Tooltip>
                    </IconButton>
                    <Menu
                      anchorEl={menuAnchor}
                      open={Boolean(menuAnchor)}
                      onClose={() => setMenuAnchor(null)}
                    >
                      <Box sx={{ p: 2, width: 250 }}>
                        <TextField
                          label="Cantidad"
                          type="number"
                          fullWidth
                          value={adjustValue}
                          onChange={(e) =>
                            setAdjustValue(Number(e.target.value))
                          }
                        />

                        <Box
                          display="flex"
                          justifyContent="center"
                          gap={1}
                          mt={2}
                        >
                          <Button
                            variant={
                              adjustType === "sumar" ? "contained" : "outlined"
                            }
                            onClick={() => setAdjustType("sumar")}
                          >
                            Sumar
                          </Button>
                          <Button
                            variant={
                              adjustType === "restar" ? "contained" : "outlined"
                            }
                            onClick={() => setAdjustType("restar")}
                          >
                            Restar
                          </Button>
                        </Box>

                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          sx={{ mt: 2 }}
                          onClick={() => {
                            const newValue =
                              adjustType === "sumar"
                                ? field.value + adjustValue
                                : Math.max(0, field.value - adjustValue);
                            field.onChange(newValue);
                            setMenuAnchor(null);
                            setAdjustValue(0);
                          }}
                        >
                          Actualizar
                        </Button>
                      </Box>
                    </Menu>
                  </Box>
                )}
              />

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={1}>
                <Grid size={{ md: 6, xs: 12 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    color="secondary"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                </Grid>
                <Grid size={{ md: 6, xs: 12 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    color="error"
                    type="submit"
                  >
                    Actualizar
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Container>
      </Fade>
    </Modal>
  );
};
