// get energy drinks from local storage
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom'

export function onDeleteSuccess(message) {
    console.log(message);
    toast(message);
}

export function cellToAxiosParamsDelete(cell) {
    return {
        url: "/api/energydrinks",
        method: "DELETE",
        params: {
            id: cell.row.values.id
        }
    }
}



const get = () => {
    const energydrinkValue = localStorage.getItem("energydrinks");//Gets the text of the value associated with the key "energydrinks" from browser local storage
    if (energydrinkValue === undefined) {
        const energydrinkCollection = { nextId: 1, energydrinks: [] }
        return set(energydrinkCollection);
    }
    const energydrinkCollection = JSON.parse(energydrinkValue);
    if (energydrinkCollection === null) {
        const energydrinkCollection = { nextId: 1, energydrinks: [] }
        return set(energydrinkCollection);
    }
    return energydrinkCollection;
};

const getById = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const energydrinkCollection = get();
    const energydrinks = energydrinkCollection.energydrinks;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = energydrinks.findIndex((e) => e.id == id);
    if (index === -1) {
        return { "error": `energy drink with id ${id} not found` };
    }
    return { energydrink: energydrinks[index] };
}

// set energy drinks in local storage
const set = (energydrinkCollection) => {
    localStorage.setItem("energydrinks", JSON.stringify(energydrinkCollection));
    return energydrinkCollection;
};

// add a energy drink to local storage
const add = (energydrink) => {
    const energydrinkCollection = get();
    energydrink = { ...energydrink, id: energydrinkCollection.nextId };
    energydrinkCollection.nextId++;
    energydrinkCollection.energydrinks.push(energydrink);
    set(energydrinkCollection);
    return energydrink;
};

// update a energydrink in local storage
const update = (energydrink) => {
    const energydrinkCollection = get();

    const energydrinks = energydrinkCollection.energydrinks;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = energydrinks.findIndex((e) => e.id == energydrink.id);
    if (index === -1) {
        return { "error": `energy drink with id ${energydrink.id} not found` };
    }
    energydrinks[index] = energydrink;
    set(energydrinkCollection);
    return { energydrinkCollection: energydrinkCollection };
};

// delete a energy drink from local storage
const del = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const energydrinkCollection = get();
    const energydrinks = energydrinkCollection.energydrinks;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = energydrinks.findIndex((e) => e.id == id);
    if (index === -1) {
        return { "error": `energy drink with id ${id} not found` };
    }
    energydrinks.splice(index, 1);
    set(energydrinkCollection);
    return { energydrinkCollection: energydrinkCollection };
};

const energydrinkUtils = {
    get,
    getById,
    add,
    update,
    del,
    onDeleteSuccess,
    cellToAxiosParamsDelete
};

export { energydrinkUtils };
