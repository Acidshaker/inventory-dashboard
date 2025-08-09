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
import {
  samePassword,
  strongPassword,
  isEmail,
  minLength,
  noTrimSpaces,
} from "../../validations/rules";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../store/uiSlice";
import { brands, categories, materials, users } from "../../services/endpoints";
import { toast } from "react-toastify";
import Grid from "@mui/material/Grid";
import { useEffect } from "react";

interface props {
  open: boolean;
  handleClose: () => void;
  data?: any;
  isEdit?: boolean;
  action: string;
  title: string;
}

export const ManagementForm = ({
  open,
  handleClose,
  data,
  isEdit = false,
  action,
  title,
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

  const schema = yup.object({
    name: yup
      .string()
      .required("Nombre requerido")
      .test(
        "no-trim-spaces",
        "No debe tener espacios al inicio o al final",
        (value) => value === value?.trim()
      ),
    description: yup
      .string()
      .required("Descripción requerida")
      .test(
        "no-trim-spaces",
        "No debe tener espacios al inicio o al final",
        (value) => value === value?.trim()
      ),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<{
    name: string;
    description: string;
  }>({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const dispatch = useDispatch();

  const onSubmit = async (body: any) => {
    dispatch(showLoading());
    try {
      switch (action) {
        case "categories":
          if (isEdit) {
            await categories.updateCategory(data.id, body);
          } else {
            await categories.createCategory(body);
          }
          break;
        case "brands":
          if (isEdit) {
            await brands.updateBrand(data.id, body);
          } else {
            await brands.createBrand(body);
          }
          break;
        case "materials":
          if (isEdit) {
            await materials.updateMaterial(data.id, body);
          } else {
            await materials.createMaterial(body);
          }
          break;
      }

      toast.success(`${title} ${isEdit ? "actualizado" : "creado"} con éxito`);
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
    console.log(action);
    if (open && isEdit && data) {
      reset({
        name: data.name || "",
        description: data.description || "",
      });
    } else if (open && !isEdit) {
      reset(
        {
          name: "",
          description: "",
        },
        { keepDirty: true }
      );
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
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            {isEdit ? `Editar ${title}` : `Crear ${title}`}
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                  label="Nombre"
                  fullWidth
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message || " "}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label="Descripción"
                  multiline
                  rows={4}
                  fullWidth
                  {...register("description")}
                  error={!!errors.description}
                  helperText={errors.description?.message || " "}
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
