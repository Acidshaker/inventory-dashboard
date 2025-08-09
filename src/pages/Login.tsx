import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import logo from "../assets/logo-leader.png";
import { isEmail, required, minLength } from "../validations/rules";
import { yupResolver } from "@hookform/resolvers/yup";
import { auth } from "../services/endpoints";
import { useDispatch } from "react-redux";
import { setToken, setUser, clearToken } from "../store/sessionsSlice";
import { showLoading, hideLoading } from "../store/uiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

const schema = yup.object({
  email: isEmail.required("Correo electrónico requerido"),
  password: yup.string().required("Contraseña requerida"),
});

const avatar_url =
  "https://gravatar.com/avatar/960a50f601537ee4946e835fbba0ead8?s=200&d=mp&r=x";

type DecodedToken = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  // Puedes agregar más campos si tu JWT los incluye
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: { email: string; password: string }) => {
    dispatch(showLoading());
    try {
      const res = await auth.login(data);
      const token = res.data.data;
      const decodedToken = jwtDecode<DecodedToken>(token);
      const user = {
        id: decodedToken.id,
        email: decodedToken.email,
        full_name: decodedToken.firstName + " " + decodedToken.lastName,
        role: decodedToken.role,
      };
      dispatch(setToken(token));
      dispatch(setUser(user));
      toast.success(`Bienvenido(a) ${user.full_name}`);
      navigate("/products");
    } catch (err) {
      // error ya manejado por interceptor
      console.log(err);
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    dispatch(clearToken());
  }, []);

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Stack spacing={3} alignItems="center">
          <img src={logo} alt="Logo" width={120} />
          <Typography variant="h5">Iniciar sesión</Typography>

          <TextField
            label="Correo electrónico"
            fullWidth
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={handleSubmit(onSubmit)}
          >
            Iniciar sesión
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Login;
