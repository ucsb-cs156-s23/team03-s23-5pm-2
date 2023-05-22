import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/energydrinkUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function EnergyDrinkTable({ energyDrinks, currentUser, actionVisible = true }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/energydrinks/edit/${cell.row.values.id}`)
    }

    const detailCallback = (cell) => {
        navigate(`/energydrinks/detail/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/energydrinks/all"]
    );
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

    const columns = React.useMemo(() => {
        const cols = [
            {
                Header: 'id',
                accessor: 'id', // accessor is the "key" in the data
            },

            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Caffeine',
                accessor: 'caffeine',
            },
            {
                Header: 'Description',
                accessor: 'description',
            }
        ];

        if (hasRole(currentUser, "ROLE_ADMIN") && actionVisible) {
            cols.push(ButtonColumn("Detail", "primary", detailCallback, "EnergyDrinkTable"));
            cols.push(ButtonColumn("Edit", "primary", editCallback, "EnergyDrinkTable"));
            cols.push(ButtonColumn("Delete", "danger", deleteCallback, "EnergyDrinkTable"));
        }

        return cols;
    }, [currentUser, actionVisible]);

    const memoizedEnergyDrinks = React.useMemo(() => energyDrinks, [energyDrinks]);

    return <OurTable
        data={memoizedEnergyDrinks}
        columns={columns}
        testid={"EnergyDrinkTable"}
    />;
};
