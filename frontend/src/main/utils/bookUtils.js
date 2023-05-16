import { toast } from "react-toastify";

export function onDeleteSuccess(message) {
    toast.success(message.message, {position: toast.POSITION.TOP_RIGHT});
}

export function cellToAxiosParamsDelete(cell) {
    return {
        url: "/api/books",
        method: "DELETE",
        params: {
            id: cell.row.values.id
        }
    }
}
