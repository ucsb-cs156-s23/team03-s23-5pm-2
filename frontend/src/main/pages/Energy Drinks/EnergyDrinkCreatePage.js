import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import EnergyDrinkForm from "main/components/Energy Drinks/EnergyDrinkForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function EnergyDrinkCreatePage() {

  const objectToAxiosParams = (energyDrink) => ({
    url: "/api/energydrinks/post",
    method: "POST",
    params: {
      name: energyDrink.name,
      caffeine: energyDrink.caffeine,
      description: energyDrink.description
    }
  });

  const onSuccess = (energyDrink) => {
    toast(`New energyDrink Created - id: ${energyDrink.id} name: ${energyDrink.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/energydrinks/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/energydrinks/list" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Energy Drink</h1>

        <EnergyDrinkForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}