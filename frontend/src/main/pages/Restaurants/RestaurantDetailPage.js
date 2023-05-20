import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RestaurantTable from 'main/components/Restaurants/RestaurantTable';
import { useBackend } from "main/utils/useBackend";
import { useCurrentUser } from 'main/utils/currentUser';

export default function RestaurantDetailPage() {
  let { id } = useParams();

  const currentUser = useCurrentUser();

  const { data: restaurant, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/restaurants/detail/${id}`],
      { method: "GET", url: `/api/restaurants?id=${id}` },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Restaurant Details</h1>
        <RestaurantTable restaurants={[restaurant]} currentUser={currentUser} actionVisible={false} />
      </div>
    </BasicLayout>
  )
}