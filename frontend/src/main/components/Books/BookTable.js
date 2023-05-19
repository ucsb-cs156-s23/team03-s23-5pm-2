import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, checkVisible, onDeleteSuccess } from "main/utils/bookUtils";
import { useNavigate } from "react-router-dom";
import {hasRole} from "main/utils/currentUser";

const BOOKS_TABLE_TEST_ID = "BooksTable";

export default function BookTable({
    books,
    currentUser,
    actionVisible = true
}) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/books/edit/${cell.row.values.id}`);
    }

    const detailCallback = (cell) => {
        navigate(`/books/detail/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching
    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        {onSuccess: onDeleteSuccess},
        ["/api/books/all"]
    )
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) =>{ deleteMutation.mutate(cell); }

    
    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'Title',
            accessor: 'title',
        },
        {
            Header: 'Author',
            accessor: 'author'
        },
        {
            Header: 'Date',
            accessor: 'date'
        },
    ];

    if (hasRole(currentUser, "ROLE_ADMIN") && checkVisible(actionVisible)) {
        columns.push(ButtonColumn("Detail", "primary", detailCallback, BOOKS_TABLE_TEST_ID));
        columns.push(ButtonColumn("Edit", "primary", editCallback, BOOKS_TABLE_TEST_ID));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, BOOKS_TABLE_TEST_ID));
    }

    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columns, [columns]);
    const memoizedBooks = React.useMemo(() => books, [books]);

    return <OurTable
        data={memoizedBooks}
        columns={memoizedColumns}
        testid={BOOKS_TABLE_TEST_ID}
    />;
};