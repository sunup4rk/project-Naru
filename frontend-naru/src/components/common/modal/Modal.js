import Swal from 'sweetalert2'

export const Modal = () => {

    const Success = (title, text) => {
        Swal.fire({
            icon: 'success',
            title: title,
            text: text,
            confirmButtonColor: "#4461AA",
            showConfirmButton: true,
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

      const Question = (title, text) => {
        Swal.fire({
            icon: "question",
          title: title,
          text: text,
          confirmButtonColor: "#4461AA",
          showConfirmButton: true,
          showCancelButton: true,
        });
      };



    return (
        {Success, Warning, Failure, Question}
    );
};
