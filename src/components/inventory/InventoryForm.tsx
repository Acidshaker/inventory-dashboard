import {
  Backdrop,
  Box,
  Button,
  Container,
  Divider,
  Fade,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../store/uiSlice";
import { inventory, users } from "../../services/endpoints";
import { toast } from "react-toastify";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";

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

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                  label="Producto"
                  fullWidth
                  value={product?.name}
                  disabled
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  label="Cantidad"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  fullWidth
                  {...register("quantity")}
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message || " "}
                />
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid size={{ md: 6, xs: 12 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
              </Grid>

              <Grid size={{ md: 6, xs: 12 }}>
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  type="submit"
                >
                  Guardar
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Fade>
    </Modal>
  );
};
