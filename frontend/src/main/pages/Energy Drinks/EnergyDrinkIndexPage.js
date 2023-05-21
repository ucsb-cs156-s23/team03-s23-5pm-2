import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import EnergyDrinkTable from 'main/components/Energy Drinks/EnergyDrinkTable';
import { useCurrentUser } from 'main/utils/currentUser'

export default function EnergyDrinkIndexPage() {

  const currentUser = useCurrentUser();

  const { data: energydrinks, error: _error, status: _status } =
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
        <EnergyDrinkTable energydrinks={energydrinks} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}