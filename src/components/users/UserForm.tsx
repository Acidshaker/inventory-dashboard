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
import { users } from "../../services/endpoints";
import { toast } from "react-toastify";
import Grid from "@mui/material/Grid";
import { useEffect } from "react";

interface props {
  open: boolean;
  handleClose: () => void;
  data?: any;
  isEdit?: boolean;
}

export const UserForm = ({
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
    width: "calc(100% - 16px)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const schema = yup.object({
    firstName: yup
      .string()
      .required("Nombre requerido")
      .test(
        "no-trim-spaces",
        "No debe tener espacios al inicio o al final",
        (value) => value === value?.trim()
      ),
    lastName: yup
      .string()
      .required("Apellido requerido")
      .test(
        "no-trim-spaces",
        "No debe tener espacios al inicio o al final",
        (value) => value === value?.trim()
      ),
    email: isEmail
      .required("Correo electrónico requerido")
      .test(
        "no-trim-spaces",
        "No debe tener espacios al inicio o al final",
        (value) => value === value?.trim()
      ),
    password: minLength(6)
      .required("Contraseña requerida")
      .test(
        "no-trim-spaces",
        "No debe tener espacios al inicio o al final",
        (value) => value === value?.trim()
      ),
    confirmPassword: yup
      .string()
      .required("Confirmar contraseña")
      .oneOf([yup.ref("password")], "Las contraseñas no coinciden")
      .test(
        "no-trim-spaces",
        "No debe tener espacios al inicio o al final",
        (value) => value === value?.trim()
      ),
    role: yup
      .string()
      .required("Rol requerido")
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
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  }>({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const dispatch = useDispatch();

  const onSubmit = async (body: any) => {
    dispatch(showLoading());
    try {
      console.log(body);
      if (!isEdit) {
        const res = await users.createUser(body);
        console.log(res.data);
      } else {
        const res = await users.updateUser(data.id, body);
        console.log(res.data);
      }
      toast.success(`Usuario ${isEdit ? "actualizado" : "creado"} con éxito`);
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
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        password: "",
        confirmPassword: "",
        role: data.role || "",
      });
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
        <Box maxWidth="md" sx={style}>
          <Typography variant="h5" gutterBottom>
            {isEdit ? "Editar Usuario" : "Crear Usuario"}
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid size={{ md: 6, xs: 12 }}>
                <TextField
                  label="Nombre(s)"
                  fullWidth
                  {...register("firstName")}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message || " "}
                />
              </Grid>

              <Grid size={{ md: 6, xs: 12 }}>
                <TextField
                  label="Apellido(s)"
                  fullWidth
                  {...register("lastName")}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message || " "}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  label="Correo electrónico"
                  fullWidth
                  disabled={isEdit}
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message || " "}
                />
              </Grid>

              <Grid size={12}>
                <FormControl fullWidth error={!!errors.role}>
                  <InputLabel id="select-label">Rol</InputLabel>
                  <Controller
                    name="role"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select labelId="select-label" label="Rol" {...field}>
                        <MenuItem value={"admin"}>Admin</MenuItem>
                        <MenuItem value={"user"}>Usuario</MenuItem>
                      </Select>
                    )}
                  />
                  <Typography variant="caption" color="error">
                    {errors.role?.message || " "}
                  </Typography>
                </FormControl>
              </Grid>

              <Grid size={12}>
                <TextField
                  label="Contraseña"
                  type="password"
                  fullWidth
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message || " "}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  label="Confirmar contraseña"
                  type="password"
                  fullWidth
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message || " "}
                />
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid size={{ md: 6, xs: 12 }}>
                <Button
                  variant="contained"
                  color="secondary"
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
        </Box>
      </Fade>
    </Modal>
  );
};
