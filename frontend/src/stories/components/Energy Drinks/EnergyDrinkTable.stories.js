import React from 'react';

import { EnergyDrinkTable } from 'main/components/Energy Drinks/EnergyDrinkTable';
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
    dates: []
};

export const ThreeDates = Template.bind({});

ThreeDates.args = {
    dates: energydrinkFixtures.threeEnergyDrinks
};


