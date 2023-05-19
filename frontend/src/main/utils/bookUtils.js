import { toast } from "react-toastify";

export function onDeleteSuccess(message) {
    console.log(message.message);
    toast.success(message.message);
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

export function checkVisible(visible){
    return visible;
}
