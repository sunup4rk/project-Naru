import Swal from 'sweetalert2'

export const Modal = () => {
    const Success = (title, text) => {
        Swal.fire({
            icon: 'success',
            title: title,
            text: text,
            confirmButtonColor: "#4461AA",
            showConfirmButton: false,
            timer: 1700,
          })
    }

    const Warning = (title, text) => {
        Swal.fire({
            icon: "warning",
          title: title,
          text: text,
          confirmButtonColor: "#4461AA",
          showConfirmButton: false,
          timer: 1700,
        });
      };

    const Failure = (title, text) => {
        Swal.fire({
        icon: "error",
          title: title,
          text: text,
          confirmButtonColor: "#4461AA",
          showConfirmButton: false,
          timer: 1700,
        });
      };

      const Info = (title, text) => {
        Swal.fire({
            icon: "info",
          title: title,
          text: text,
          confirmButtonColor: "#4461AA",
          showConfirmButton: true,
          showCancelButton: false,
        });
      };

    return (
        {Success, Warning, Failure, Info}
    );
};
