import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import EnergyDrinkTable from 'main/components/Energy Drinks/EnergyDrinkTable';
import { energydrinkUtils } from 'main/utils/energydrinkUtils';

export default function EnergyDrinkDetailsPage() {
  let { id } = useParams();

  const response = energydrinkUtils.getById(id);

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Energy Drink Details</h1>
        <EnergyDrinkTable energydrinks={[response.energydrink]} showButtons={false} />
      </div>
    </BasicLayout>
  )
}
