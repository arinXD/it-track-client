import Swal from "sweetalert2";

export const swal = Swal.mixin({
     customClass: {
          confirmButton: "btn bg-blue-500 border-1 border-blue-500 text-white ms-3 hover:bg-blue-600 hover:border-blue-500",
          cancelButton: "btn text-black border shadow-none bg-white border-white hover:border-blue-500 hover:bg-white hover:text-blue-500"
     },
     buttonsStyling: false
})
