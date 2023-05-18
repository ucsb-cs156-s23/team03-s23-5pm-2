import React from 'react';
import BookForm from 'main/components/Books/BookForm';
import { bookFixtures } from 'fixtures/bookFixtures';

export default {
    title: 'components/Books/BookForm',
    component: BookForm
};

const Template = (args) => {
    return (
        <BookForm {...args}/>
    )
};

export const Default = Template.bind({});

Default.args = {
    buttonLabel: "Create",
    submitAction: () => {console.log("Submit was clicked");}
};

export const Show = Template.bind({});

Show.args = {
    initialContents: bookFixtures.oneBook[0],
    buttonLabel: "Update",
    submitAction:  () => {console.log("Submit was clicked");}
};
