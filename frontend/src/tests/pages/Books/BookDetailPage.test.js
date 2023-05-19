import { render, waitFor } from "@testing-library/react";
import BookDetailPage from "main/pages/Books/BookDetailPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import mockConsole from "jest-mock-console";
import * as backendModule from "main/utils/useBackend";
import * as bookUtilModule from "main/utils/bookUtils";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";


const BOOKS_TABLE_TEST_ID = "BooksTable";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; },
        useParams: () => ({
            id: 15
        }),
    };
});

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("BookDetailPage tests", () => {
    const axiosMock =new AxiosMockAdapter(axios);

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    test("loads the correct fields, and no buttons", async ()=>{
        setupUserOnly();
        const queryClient = new QueryClient();
        const book = {
            id: 15,
            title: "some test title",
            author: "some test author",
            date: "2023-04-17"
        }

        axiosMock.onGet("/api/books?id=15").reply(202, book);

        const { getByTestId, queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <BookDetailPage />
            </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => { expect(getByTestId(`${BOOKS_TABLE_TEST_ID}-cell-row-0-col-id`)).toHaveTextContent("15"); });
        expect(getByTestId(`${BOOKS_TABLE_TEST_ID}-cell-row-0-col-title`)).toHaveTextContent("some test title");
        expect(getByTestId(`${BOOKS_TABLE_TEST_ID}-cell-row-0-col-author`)).toHaveTextContent("some test author");
        expect(getByTestId(`${BOOKS_TABLE_TEST_ID}-cell-row-0-col-date`)).toHaveTextContent("2023-04-17");
        expect(queryByTestId("BooksTable-cell-row-0-col-Detail-button")).not.toBeInTheDocument();
        expect(queryByTestId("BooksTable-cell-row-0-col-Edit-button")).not.toBeInTheDocument();
        expect(queryByTestId("BooksTable-cell-row-0-col-Delete-button")).not.toBeInTheDocument();
    });

    test("toast error notification and console error message when id doesn't exit in database", async ()=> {
       setupUserOnly();
       const queryClient = new QueryClient();
       axiosMock.onGet("/api/books?id=15").reply(404, {message:"Book with id 15 not found", type: "EntityNotFoundException"});
       const restoreConsole = mockConsole();

       render(
        <QueryClientProvider client={queryClient}>
        <MemoryRouter>
            <BookDetailPage />
        </MemoryRouter>
        </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });
        
        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/books?id=15");
        restoreConsole();

        expect(mockToast).toBeCalled();
        expect(mockToast).toHaveBeenCalledWith("Error communicating with backend via GET on /api/books?id=15");

    });

    // test('BookTable has the correct visible status', async () => {
    //     setupUserOnly();
    //     const queryClient = new QueryClient();

    //     const newMock = jest.fn();
    //     bookUtilModule.checkVisible = newMock;

    //     const book = {
    //         id: 15,
    //         title: "some test title",
    //         author: "some test author",
    //         date: "2023-04-17"
    //     }

    //     axiosMock.onGet("/api/books?id=15").reply(202, book);

    //     render(
    //         <QueryClientProvider client={queryClient}>
    //         <MemoryRouter>
    //             <BookDetailPage />
    //         </MemoryRouter>
    //         </QueryClientProvider>
    //     );

    //     await waitFor(()=> {expect(newMock).toBeCalled()});
    // });


    test('useBackend params are correct', async () => {
        setupUserOnly();
        const queryClient = new QueryClient();

        const useBackendSpyFunc = jest.spyOn(backendModule, 'useBackend');

        const book = {
            id: 15,
            title: "some test title",
            author: "some test author",
            date: "2023-04-17"
        }

        axiosMock.onGet("/api/books?id=15").reply(202, book);

        render(
            <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <BookDetailPage />
            </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });
        expect(useBackendSpyFunc).toBeCalled();
        expect(useBackendSpyFunc).toBeCalledWith( ["/api/books/detail/15"], { method: "GET", url: `/api/books?id=15`}, []);
    });
});