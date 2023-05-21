import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import EnergyDrinkTable from 'main/components/EnergyDrinks/EnergyDrinkTable';
import { useBackend } from "main/utils/useBackend";
import { useCurrentUser } from 'main/utils/currentUser';

export default function EnergyDrinkDetailsPage() {
  let { id } = useParams();

  const currentUser = useCurrentUser();

  const { data: energyDrinks, error: _error, status: _status } =
  useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/energydrinks/detail/${id}`],
    { method: "GET", url: `/api/energydrinks?id=${id}` },
    []
  );

  
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Energy Drink Details</h1>
        <EnergyDrinkTable energyDrinks={[energyDrinks]} currentUser={currentUser} actionVisible={false} />
      </div>
    </BasicLayout>
  )
}
