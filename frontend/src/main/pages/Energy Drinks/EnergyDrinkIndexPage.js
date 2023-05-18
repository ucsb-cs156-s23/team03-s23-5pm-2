import React from 'react'
import Button from 'react-bootstrap/Button';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import EnergyDrinkTable from 'main/components/Energy Drinks/EnergyDrinkTable';
import { energydrinkUtils } from 'main/utils/energydrinkUtils';
import { useNavigate, Link } from 'react-router-dom';

export default function EnergyDrinkIndexPage() {

    const navigate = useNavigate();

    const energydrinkCollection = energydrinkUtils.get();
    const energydrinks = energydrinkCollection.energydrinks;

    const showCell = (cell) => JSON.stringify(cell.row.values);

    const deleteCallback = async (cell) => {
        console.log(`EnergyDrinkIndexPage deleteCallback: ${showCell(cell)})`);
        energydrinkUtils.del(cell.row.values.id);
        navigate("/energydrinks");
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <Button style={{ float: "right" }} as={Link} to="/energydrinks/create">
                    Create Energy Drink
                </Button>
                <h1>Energy Drinks</h1>
                <EnergyDrinkTable energydrinks={energydrinks} deleteCallback={deleteCallback} />
            </div>
        </BasicLayout>
    )
}