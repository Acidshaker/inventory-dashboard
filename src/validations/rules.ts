import * as yup from "yup";

/** 🔐 Campo obligatorio */
export const required = yup.string().required('Este campo es obligatorio');

/** 📧 Validación de correo electrónico */
export const isEmail = yup.string().email('Correo inválido');

/** 🔠 Longitud mínima dinámica */
export const minLength = (length: number) =>
  yup.string().min(length, `Debe tener al menos ${length} caracteres`);

/** 🔡 Longitud máxima dinámica */
export const maxLength = (length: number) =>
  yup.string().max(length, `No puede tener más de ${length} caracteres`);

/** 🔢 Solo números */
export const onlyNumbers = yup
  .string()
  .matches(/^\d+$/, 'Solo se permiten números');

  /** 🚫 No permite números negativos */
export const noNegative = yup
  .number()
  .typeError('Debe ser un número válido')
  .min(0, 'No se permiten números negativos');

/** 🔢 Solo números enteros (sin decimales) */
export const onlyIntegers = yup
  .number()
  .typeError('Debe ser un número entero')
  .integer('No se permiten decimales');

/** 💰 Permite decimales pero máximo 2 */
export const maxTwoDecimals = yup
  .number()
  .typeError('Debe ser un número válido')
  .test(
    'max-two-decimals',
    'Solo se permiten hasta 2 decimales',
    value => value === undefined || /^\d+(\.\d{1,2})?$/.test(value.toString())
  );

/** 🆎 Solo letras */
export const onlyLetters = yup
  .string()
  .matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, 'Solo letras y espacios');

/** 🧹 Sin espacios al inicio o al final */
export const noTrimSpaces = yup
  .string()
  .test(
    'no-trim-spaces',
    'No debe tener espacios al inicio o al final',
    (value) => value === value?.trim()
  );

/** 🔑 Contraseña segura */
export const strongPassword = yup
  .string()
  .min(8, 'Debe tener al menos 8 caracteres')
  .matches(/[a-z]/, 'Debe incluir minúsculas')
  .matches(/[A-Z]/, 'Debe incluir mayúsculas')
  .matches(/\d/, 'Debe incluir números')
  .matches(/[@$!%*?&#]/, 'Debe incluir caracteres especiales');

/** 🔁 Validación para confirmar contraseña */
export const samePassword = (password: string) =>
  yup.string().oneOf([password], 'Las contraseñas no coinciden');
