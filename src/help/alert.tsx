import swal from "sweetalert";
export const onErrorMessage = (message: string, e) => {
    swal("Opps", message, "error");
    console.error(e);
};