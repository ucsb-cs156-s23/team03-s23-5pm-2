import React from 'react';

import BookTable from 'main/components/Books/BookTable';
import { bookFixtures } from 'fixtures/bookFixtures';

export default {
    title: 'components/Books/BookTable',
    component: BookTable
};

const Template = (args) => {
    return (
        <BookTable {...args} />
    )
}

export const Empty = Template.bind({});

Empty.args = {
    books: []
};

export const ThreeBooksNoAdmin = Template.bind({})

ThreeBooksNoAdmin.args = {
    books: bookFixtures.threeBooks,
    currentUser: {}
}

export const ThreeBooksButtonColumn = Template.bind({});

ThreeBooksButtonColumn.args = {
    books: bookFixtures.threeBooks,
    actionVisible: true,
    currentUser: {
        data: {
        root: {
            rolesList: ['ROLE_ADMIN']
        }
    } }
}

export const ThreeBooksButtonColumnInVisible = Template.bind({});

ThreeBooksButtonColumnInVisible.args = {
    books: bookFixtures.threeBooks,
    actionVisible: false,
    currentUser: {
        data: {
        root: {
            rolesList: ['ROLE_ADMIN']
        }
    } }
}