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
  Select,
  TextField,
  Typography,
  Grid,
  Autocomplete,
  Stack,
  InputAdornment,
  Paper,
  ButtonGroup,
  Tooltip,
  OutlinedInput,
} from "@mui/material";
import { useForm, Controller, set } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../store/uiSlice";
import {
  brands,
  categories,
  materials,
  products,
} from "../../services/endpoints";
import { toast } from "react-toastify";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import PaletteIcon from "@mui/icons-material/Palette";
import { FileUpload } from "../shared/FileUpload";
import AsyncAutocomplete, {
  type AsyncAutocompleteRef,
} from "../shared/AsyncAutocomplete";
import { ManagementForm } from "../management/ManagementForm";

interface Props {
  open: boolean;
  handleClose: () => void;
  item?: any;
  isEdit?: boolean;
}

interface ProductFormData {
  sku: string;
  name: string;
  brand: string;
  category: string;
  material: string;
  finish: string;
  color: string;
  width: number;
  length: number;
  thickness: number;
  minQuantity: number;
  equivalence: number;
}

interface dataProducts {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export const ProductForm = ({
  open,
  handleClose,
  item,
  isEdit = false,
}: Props) => {
  const dispatch = useDispatch();
  const [productImage, setProductImage] = useState<File | null>(null);
  const [imageDeleted, setImageDeleted] = useState(false);
  const [widthUnit, setWidthUnit] = useState<"mm" | "in">("mm");
  const [lengthUnit, setLengthUnit] = useState<"m" | "yd">("m");
  const [thicknessUnit, setThicknessUnit] = useState<"µm" | "mil">("µm");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [configAddModal, setConfigAddModal] = useState<{
    action: string;
    title: string;
  }>({ action: "", title: "" });
  const categoryRef = useRef<AsyncAutocompleteRef>(null);
  const brandRef = useRef<AsyncAutocompleteRef>(null);
  const materialRef = useRef<AsyncAutocompleteRef>(null);

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    maxHeight: "90vh",
    overflowY: "auto",
    borderRadius: 2,
  };

  const maxThreeDecimals = (value: number) => {
    if (value === undefined || value === null) return true;
    return /^\d+(\.\d{1,3})?$/.test(value.toString());
  };

  const schema = yup.object({
    sku: yup.string().required("SKU requerido"),
    name: yup.string().required("Nombre requerido"),
    brand: yup.string().required("Marca requerida"),
    category: yup.string().required("Categoría requerida"),
    material: yup.string().required("Material requerido"),
    finish: yup.string().required("Acabado requerido"),
    color: yup.string().required("Color requerido"),

    width: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : parseFloat(originalValue)
      )
      .min(0.1, "Ancho debe ser mayor a 0")
      .required("Ancho requerido")
      .test("max-decimals", "Máximo 3 decimales permitidos", maxThreeDecimals),

    length: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : parseFloat(originalValue)
      )
      .min(0.1, "Largo debe ser mayor a 0")
      .required("Largo requerido")
      .test("max-decimals", "Máximo 3 decimales permitidos", maxThreeDecimals),

    thickness: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : parseFloat(originalValue)
      )
      .min(0.1, "Espesor debe ser mayor a 0")
      .required("Espesor requerido")
      .test("max-decimals", "Máximo 3 decimales permitidos", maxThreeDecimals),

    minQuantity: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : parseFloat(originalValue)
      )
      .min(-1, "No se permiten cantidades negativas")
      .required("Cantidad mínima requerida")
      .test(
        "no-decimals",
        "No se permiten decimales",
        (value) => value === undefined || /^\d+$/.test(value.toString())
      ),

    equivalence: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : parseFloat(originalValue)
      )
      .min(0, "Equivalencia debe ser mayor a 0")
      .required("Equivalencia requerida")
      .test(
        "no-decimals",
        "No se permiten decimales",
        (value) => value === undefined || /^\d+$/.test(value.toString())
      ),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const clearData = () => {
    setProductImage(null);
    setLengthUnit("m");
    setWidthUnit("mm");
    setThicknessUnit("µm");
    reset({
      sku: "",
      name: "",
      brand: "",
      category: "",
      material: "",
      finish: "",
      color: "",
      width: 0,
      length: 0,
      thickness: 0,
    });
  };

  const onSubmit = async (data: ProductFormData) => {
    dispatch(showLoading());
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("sku", data.sku);
      formData.append("brandId", data.brand);
      formData.append("categoryId", data.category);
      formData.append("materialId", data.material);
      formData.append("width", String(data.width));
      formData.append("widthUnit", widthUnit);
      formData.append("length", String(data.length));
      formData.append("lengthUnit", lengthUnit);
      formData.append("thickness", String(data.thickness));
      formData.append("thicknessUnit", thicknessUnit);
      formData.append("color", data.color);
      formData.append("finish", data.finish);
      formData.append("equivalence", String(data.equivalence));
      formData.append("minStock", String(data.minQuantity));

      if (isEdit) {
        const hadImage = !!item?.productImage;

        if (imageDeleted && hadImage) {
          formData.append("deleteImage", "true"); // 🗑️ Imagen eliminada
        } else if (productImage instanceof File) {
          formData.append("file", productImage); // ✅ Imagen nueva
        }
        // 🟡 Si no se modificó, no se envía nada
      } else {
        if (productImage instanceof File) {
          formData.append("file", productImage); // 🆕 Imagen nueva en modo creación
        }
      }

      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      const res = isEdit
        ? await products.updateProduct(item.id, formData)
        : await products.createProduct(formData);

      console.log(res.data);
      toast.success(`Producto ${isEdit ? "actualizado" : "creado"} con éxito`);
      handleClose();
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(hideLoading());
    }
  };

  const getMaterials = (params: { search: string; page: number }) =>
    materials.getMaterials(params);

  const getCategories = (params: { search: string; page: number }) =>
    categories.getCategories(params);

  const getBrands = (params: { search: string; page: number }) =>
    brands.getBrands(params);

  const handleOpenAddModal = (title: string, action: string) => {
    if (title && action) {
      setConfigAddModal({ title, action });
      setOpenAddModal(true);
    }
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    if (configAddModal.action === "categories") {
      categoryRef.current?.reload();
    } else if (configAddModal.action === "brands") {
      brandRef.current?.reload();
    } else if (configAddModal.action === "materials") {
      materialRef.current?.reload();
    }
    setConfigAddModal({ action: "", title: "" });
  };
  const handleCancel = () => {
    reset();
    handleClose();
  };

  useEffect(() => {
    if (open && isEdit && item) {
      reset({
        sku: item.sku,
        name: item.name,
        brand: item.brand.id,
        category: item.category.id,
        material: item.material.id,
        finish: item.finish,
        color: item.color,
        width: item.width,
        length: item.length,
        thickness: item.thickness,
        minQuantity: item.minStock,
        equivalence: item.equivalence,
      });
      setLengthUnit(item.lengthUnit);
      setWidthUnit(item.widthUnit);
      setThicknessUnit(item.thicknessUnit);
      setProductImage(null);
      setImageDeleted(false);
    } else if (open && !isEdit) {
      clearData();
    }
  }, [open, isEdit, item, reset]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open}>
        <Container maxWidth="md" sx={style}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            {isEdit ? "Editar producto" : "Crear producto"}
          </Typography>

          <form
            onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))}
          >
            <Grid container spacing={2}>
              {/* Columna izquierda: inputs */}
              <Grid size={{ md: 7, xs: 12 }}>
                <Stack spacing={1}>
                  <TextField
                    label="SKU"
                    fullWidth
                    {...register("sku")}
                    error={!!errors.sku}
                    helperText={errors.sku?.message || " "}
                    size="small"
                  />

                  <TextField
                    label="Nombre"
                    fullWidth
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message || " "}
                    size="small"
                  />

                  <AsyncAutocomplete
                    ref={brandRef}
                    name="brand"
                    label="Marca"
                    control={control}
                    errors={errors}
                    fetchFn={getBrands}
                    onAddClick={() => handleOpenAddModal("marca", "brands")}
                  />

                  <AsyncAutocomplete
                    ref={categoryRef}
                    name="category"
                    label="Categoría"
                    control={control}
                    errors={errors}
                    fetchFn={getCategories}
                    onAddClick={() =>
                      handleOpenAddModal("categoría", "categories")
                    }
                  />

                  <AsyncAutocomplete
                    ref={materialRef}
                    name="material"
                    label="Material"
                    control={control}
                    errors={errors}
                    fetchFn={getMaterials}
                    onAddClick={() =>
                      handleOpenAddModal("material", "materials")
                    }
                  />
                </Stack>
              </Grid>

              {/* Columna derecha: imagen */}
              <Grid size={{ md: 5, xs: 12 }}>
                <FileUpload
                  value={productImage}
                  onChange={(file) => {
                    setProductImage(file);
                    if (file) setImageDeleted(false); // imagen nueva
                  }}
                  onDelete={() => {
                    setProductImage(null);
                    setImageDeleted(true); // imagen eliminada
                  }}
                  initialUrl={item?.productImage}
                />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" sx={{ my: 2 }}>
              Detalles del producto
            </Typography>

            <Grid container spacing={2} justifyContent="flex-end">
              <Grid size={{ md: 6, xs: 12 }}>
                <TextField
                  label="Contenido de rollos por caja"
                  fullWidth
                  {...register("equivalence")}
                  type="number"
                  InputProps={{ inputProps: { min: 1 } }}
                  error={!!errors.equivalence}
                  helperText={errors.equivalence?.message || " "}
                />
              </Grid>
              <Grid size={{ md: 6, xs: 12 }}>
                <TextField
                  label="Alerta de stock (mínimo de stock)"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  fullWidth
                  {...register("minQuantity")}
                  error={!!errors.minQuantity}
                  helperText={errors.minQuantity?.message || " "}
                />
              </Grid>
              <Grid size={{ md: 6, xs: 12 }}>
                <TextField
                  label="Color"
                  fullWidth
                  {...register("color")}
                  error={!!errors.color}
                  helperText={errors.color?.message || " "}
                />
              </Grid>
              <Grid size={{ md: 6, xs: 12 }}>
                <Controller
                  name="finish"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={["Mate", "Brillante", "Satinado"]}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Acabado"
                          error={!!errors.finish}
                          helperText={errors.finish?.message || " "}
                        />
                      )}
                      {...field}
                      onChange={(_, value) => field.onChange(value)}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ md: 4, xs: 12 }}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  error={!!errors.width}
                >
                  <InputLabel htmlFor="outlined-adornment-width">
                    Ancho
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-width"
                    type="number"
                    inputProps={{ step: "0.001" }}
                    {...register("width")}
                    endAdornment={
                      <InputAdornment position="end">
                        <ButtonGroup size="small">
                          <Tooltip title="milimetros">
                            <Button
                              variant={
                                widthUnit === "mm" ? "contained" : "outlined"
                              }
                              onClick={() => setWidthUnit("mm")}
                            >
                              mm
                            </Button>
                          </Tooltip>
                          <Tooltip title="pulgadas">
                            <Button
                              variant={
                                widthUnit === "in" ? "contained" : "outlined"
                              }
                              onClick={() => setWidthUnit("in")}
                            >
                              in
                            </Button>
                          </Tooltip>
                        </ButtonGroup>
                      </InputAdornment>
                    }
                    label="Ancho"
                  />
                  <Typography variant="caption" color="error">
                    {errors.width?.message || " "}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid size={{ md: 4, xs: 12 }}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  error={!!errors.length}
                >
                  <InputLabel htmlFor="outlined-adornment-length">
                    Largo
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-length"
                    type="number"
                    {...register("length")}
                    inputProps={{ step: "0.001" }}
                    endAdornment={
                      <InputAdornment position="end">
                        <ButtonGroup size="small">
                          <Tooltip title="metros">
                            <Button
                              variant={
                                lengthUnit === "m" ? "contained" : "outlined"
                              }
                              onClick={() => setLengthUnit("m")}
                            >
                              m
                            </Button>
                          </Tooltip>
                          <Tooltip title="yardas">
                            <Button
                              variant={
                                lengthUnit === "yd" ? "contained" : "outlined"
                              }
                              onClick={() => setLengthUnit("yd")}
                            >
                              yd
                            </Button>
                          </Tooltip>
                        </ButtonGroup>
                      </InputAdornment>
                    }
                    label="Largo"
                  />
                  <Typography variant="caption" color="error">
                    {errors.length?.message || " "}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid size={{ md: 4, xs: 12 }}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  error={!!errors.thickness}
                >
                  <InputLabel htmlFor="outlined-adornment-thickness">
                    Espesor
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-thickness"
                    type="number"
                    {...register("thickness")}
                    inputProps={{ step: "0.001" }}
                    endAdornment={
                      <InputAdornment position="end">
                        <ButtonGroup size="small">
                          <Tooltip title="micrones">
                            <Button
                              variant={
                                thicknessUnit === "µm"
                                  ? "contained"
                                  : "outlined"
                              }
                              onClick={() => setThicknessUnit("µm")}
                            >
                              um
                            </Button>
                          </Tooltip>
                          <Tooltip title="milesimas de pulgada">
                            <Button
                              variant={
                                thicknessUnit === "mil"
                                  ? "contained"
                                  : "outlined"
                              }
                              onClick={() => setThicknessUnit("mil")}
                            >
                              mil
                            </Button>
                          </Tooltip>
                        </ButtonGroup>
                      </InputAdornment>
                    }
                    label="Espesor"
                  />
                  <Typography variant="caption" color="error">
                    {errors.thickness?.message || " "}
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2} justifyContent="flex-end">
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
          <ManagementForm
            open={openAddModal}
            handleClose={handleCloseAddModal}
            action={configAddModal?.action}
            title={configAddModal?.title}
          />
        </Container>
      </Fade>
    </Modal>
  );
};
