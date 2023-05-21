import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import EnergyDrinkForm from "main/components/Energy Drinks/EnergyDrinkForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function EnergyDrinkEditPage() {
  let { id } = useParams();

  const { data: energydrink, error, status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/energydrinks?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/energydrinks`,
        params: {
          id
        }
      }
    );


  const objectToAxiosPutParams = (energydrink) => ({
    url: "/api/energydrinks",
    method: "PUT",
    params: {
      id: energydrink.id,
    },
    data: {
      name: energydrink.name,
      description: energydrink.description
    }
  });

  const onSuccess = (energydrink) => {
    toast(`EnergyDrink Updated - id: ${energydrink.id} name: ${energydrink.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/energydrinks?id=${id}`]
  );

  const { isSuccess } = mutation

  if (isSuccess) {
    return <Navigate to="/energydrinks/list" />
  }

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }


  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Energy Drink</h1>
        {energydrink &&
          <EnergyDrinkForm initialContents={energydrink} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}
