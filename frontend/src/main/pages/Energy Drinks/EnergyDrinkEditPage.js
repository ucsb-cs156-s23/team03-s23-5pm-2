import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import { energydrinkUtils } from 'main/utils/energydrinkUtils';
import EnergyDrinkForm from 'main/components/Energy Drinks/EnergyDrinkForm';
import { useNavigate } from 'react-router-dom';


export default function EnergyDrinkEditPage() {
    let { id } = useParams();

    let navigate = useNavigate();

    const response = energydrinkUtils.getById(id);

    const onSubmit = async (energydrink) => {
        const updatedEnergyDrink = energydrinkUtils.update(energydrink);
        console.log("updatedEnergyDrink: " + JSON.stringify(updatedEnergyDrink));
        navigate("/energydrinks");
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit EnergyDrink</h1>
                <EnergyDrinkForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={response.energydrink} />
            </div>
        </BasicLayout>
    )
}