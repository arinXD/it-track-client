import Swal from "sweetalert2";

export const swal = Swal.mixin({
     customClass: {
          confirmButton: "btn bg-blue-500 border-1 border-blue-500 text-white ms-3 hover:bg-blue-600 hover:border-blue-500",
          cancelButton: "btn border shadow-none text-blue-500 bg-white border-white hover:border-blue-500 hover:bg-white"
     },
     buttonsStyling: false
})
