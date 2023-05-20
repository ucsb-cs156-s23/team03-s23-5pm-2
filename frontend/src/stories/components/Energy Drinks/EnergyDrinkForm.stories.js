import React from 'react';

import { EnergyDrinkForm } from 'main/components/Energy Drinks/EnergyDrinkForm';
import { energydrinkFixtures } from 'fixtures/energydrinkFixtures';

export default {
    title: 'components/Energy Drinks/EnergyDrinkForm',
    component: EnergyDrinkForm
};


const Template = (args) => {
    return (
        <EnergyDrinkForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    energyDrink: energydrinkFixtures.oneEnergyDrink,
    submitText: "",
    submitAction: () => { }
};
