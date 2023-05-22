import React from 'react';

import { EnergyDrinkTable } from 'main/components/EnergyDrinks/EnergyDrinkTable';
import { energydrinkFixtures } from 'fixtures/energydrinkFixtures';

export default {
    title: 'components/Energy Drinks/EnergyDrinkTable',
    component: EnergyDrinkTable
};

const Template = (args) => {
    return (
        <EnergyDrinkTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    energyDrinks: []
};

export const ThreeEnergyDrinks = Template.bind({});

ThreeEnergyDrinks.args = {
    energyDrinks: energydrinkFixtures.threeEnergyDrinks
};


