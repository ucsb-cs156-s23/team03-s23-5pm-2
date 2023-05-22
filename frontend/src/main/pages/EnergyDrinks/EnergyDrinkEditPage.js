import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import EnergyDrinkForm from "main/components/EnergyDrinks/EnergyDrinkForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function EnergyDrinkEditPage() {
  let { id } = useParams();

  const { data: energyDrink, error, status } =
    useBackend(
      // Stryker disable next-line all : don'tgit  test internal caching of React Query
      [`/api/energydrinks?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/energydrinks`,
        params: {
          id
        }
      }
    );


  const objectToAxiosPutParams = (energyDrink) => ({
    url: "/api/energydrinks",
    method: "PUT",
    params: {
      id: energyDrink.id,
    },
    data: {
      name: energyDrink.name,
      description: energyDrink.description,
      caffeine: energyDrink.caffeine
    }
  });

  const onSuccess = (energyDrink) => {
    toast(`EnergyDrink Updated - id: ${energyDrink.id} name: ${energyDrink.name}`);
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
        {energyDrink &&
          <EnergyDrinkForm initialContents={energyDrink} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}
