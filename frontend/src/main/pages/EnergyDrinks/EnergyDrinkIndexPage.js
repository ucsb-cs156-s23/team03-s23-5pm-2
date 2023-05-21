import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import EnergyDrinkTable from 'main/components/EnergyDrinks/EnergyDrinkTable';
import { useCurrentUser } from 'main/utils/currentUser'

export default function EnergyDrinkIndexPage() {

  const currentUser = useCurrentUser();

  const { data: energyDrinks, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/energydrinks/all"],
      { method: "GET", url: "/api/energydrinks/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Restaurants</h1>
        <EnergyDrinkTable energyDrinks={energyDrinks} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}