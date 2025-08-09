import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const deleteAlert = async (text: string, foo: () => Promise<any>) => {
  MySwal.fire({
    title: `Atención`,
    text: `${text}`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#f12e86",
    confirmButtonText: "Continuar",
    cancelButtonText: "Cancelar",
    customClass: {
      cancelButton: "alert-btn cancel",
      confirmButton: "alert-btn confirm",
      container: "alert-container",
    },
    reverseButtons: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await foo();
      } catch (err) {
        console.log(err);
      }
    }
  });
};

export const confirmationAlert = async (
  foo: () => Promise<any>,
  title?: string
) => {
  MySwal.fire({
    title: `${title || "Seguro que deseas realizar esta acción?"}`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#f12e86",
    confirmButtonText: "Continuar",
    cancelButtonText: "Cancelar",
    customClass: {
      cancelButton: "alert-btn cancel",
      confirmButton: "alert-btn confirm",
      container: "alert-container",
    },
    reverseButtons: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await foo();
        // Swal.fire({
        //   title: 'Eliminado',
        //   text: `Acción realizada con éxito`,
        //   icon: 'success',
        //   confirmButtonText: 'Aceptar',
        //   customClass: {
        //     confirmButton: 'alert-btn confirm',
        //     container: 'alert-container'
        //   }
        // });
      } catch (err) {
        // Swal.fire({
        //   title: 'Atención',
        //   text: 'No se ha podido realizar la acción, intente nuevamente',
        //   icon: 'error',
        //   confirmButtonText: 'Aceptar',
        //   customClass: {
        //     confirmButton: 'alert-btn confirm',
        //     container: 'alert-container'
        //   }
        // });
      }
    }
  });
};

export const confirmationAlert2 = async (
  foo: () => Promise<any>,
  cancelFoo: () => Promise<any>,
  title?: string
) => {
  MySwal.fire({
    title: `${title || "Seguro que deseas realizar esta acción?"}`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#f12e86",
    confirmButtonText: "Continuar",
    cancelButtonText: "Cancelar",
    customClass: {
      cancelButton: "alert-btn cancel",
      confirmButton: "alert-btn confirm",
      container: "alert-container",
    },
    reverseButtons: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await foo();
        // Swal.fire({
        //   title: 'Eliminado',
        //   text: `Acción realizada con éxito`,
        //   icon: 'success',
        //   confirmButtonText: 'Aceptar',
        //   customClass: {
        //     confirmButton: 'alert-btn confirm',
        //     container: 'alert-container'
        //   }
        // });
      } catch (err) {
        // Swal.fire({
        //   title: 'Atención',
        //   text: 'No se ha podido realizar la acción, intente nuevamente',
        //   icon: 'error',
        //   confirmButtonText: 'Aceptar',
        //   customClass: {
        //     confirmButton: 'alert-btn confirm',
        //     container: 'alert-container'
        //   }
        // });
      }
    } else {
      await cancelFoo();
    }
  });
};

export const errorAlert = (description: string) => {
  MySwal.fire({
    title: "Atención",
    text: description,
    icon: "error",
    confirmButtonText: "Aceptar",
    customClass: {
      confirmButton: "alert-btn confirm",
      container: "alert-container",
    },
  });
};

export const successAlert = (description: string, foo?: () => Promise<any>) => {
  MySwal.fire({
    title: "Atención",
    text: description,
    icon: "success",
    confirmButtonText: "Aceptar",
    customClass: {
      confirmButton: "alert-btn confirm",
      container: "alert-container",
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      if (foo) {
        await foo();
      }
    }
  });
};
