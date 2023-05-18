import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RestaurantTable from 'main/components/Restaurants/RestaurantTable';
import { restaurantUtils } from 'main/utils/restaurantUtils';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

export default function RestaurantDetailsPage() {
  let { id } = useParams();

  const response = restaurantUtils.getById(id);

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Restaurant Details</h1>
        <RestaurantTable restaurants={[response.restaurant]} showButtons={false} />
      </div>
    </BasicLayout>
  )
}
