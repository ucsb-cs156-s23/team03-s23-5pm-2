import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import EnergyDrinkForm from "main/components/Energy Drinks/EnergyDrinkForm";
import { useNavigate } from 'react-router-dom'
import { energydrinkUtils } from 'main/utils/energydrinkUtils';
import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

export default function EnergyDrinkCreatePage() {

    let navigate = useNavigate();

    const onSubmit = async (energydrink) => {
        const createdEnergyDrink = energydrinkUtils.add(energydrink);
        console.log("createdEnergyDrink: " + JSON.stringify(createdEnergyDrink));
        navigate("/energydrinks");
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Create New EnergyDrink</h1>
                <EnergyDrinkForm submitAction={onSubmit} />
            </div>
        </BasicLayout>
    )
}