import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import BookIndexPage from "main/pages/Books/BookIndexPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { bookFixtures } from "fixtures/bookFixtures";

import axios from "axios";
import {toast} from 'react-toastify'
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const BOOKS_TABLE_TEST_ID = "BooksTable";

jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: {
            success: jest.fn(),
        },
    };
});

describe("BookIndexPage tests", () => {
    const axiosMock =new AxiosMockAdapter(axios);

    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        console.error.mockRestore();
    });

    afterEach(() => {
        console.error.mockClear();
    });


    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    test("renders without crashing for regular user", () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/books/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders without crashing for admin user", () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/books/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders three books without crashing for regular user", async () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/books/all").reply(200, bookFixtures.threeBooks );
        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${BOOKS_TABLE_TEST_ID}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(getByTestId(`${BOOKS_TABLE_TEST_ID}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(getByTestId(`${BOOKS_TABLE_TEST_ID}-cell-row-2-col-id`)).toHaveTextContent("3");
    });

    test("renders three dates without crashing for admin user", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/books/all").reply(200, bookFixtures.threeBooks);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${BOOKS_TABLE_TEST_ID}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(getByTestId(`${BOOKS_TABLE_TEST_ID}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(getByTestId(`${BOOKS_TABLE_TEST_ID}-cell-row-2-col-id`)).toHaveTextContent("3");
    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/books/all").timeout();

        const restoreConsole = mockConsole();

        const { queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });
        expect(console.error).toHaveBeenCalled();
        // const errorMessage = console.error.mock.calls[0][0];
        // expect(errorMessage).toMatch("Error communicating with backend via GET on /api/books/all");
        // restoreConsole();

        expect(queryByTestId(`${BOOKS_TABLE_TEST_ID}-cell-row-0-col-id`)).not.toBeInTheDocument();
    });

    test("what happens when you click delete, admin", async () => {
        setupAdminUser();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/books/all").reply(200, bookFixtures.threeBooks );
        axiosMock.onDelete("/api/books").reply(200, { message: "Book with id 1 was deleted"});


        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${BOOKS_TABLE_TEST_ID}-cell-row-0-col-id`)).toBeInTheDocument(); });

       expect(getByTestId(`${BOOKS_TABLE_TEST_ID}-cell-row-0-col-id`)).toHaveTextContent("1"); 


        const deleteButton = getByTestId(`${BOOKS_TABLE_TEST_ID}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
       
        fireEvent.click(deleteButton);

        await waitFor(() => {expect(toast.success).toBeCalledWith("Book with id 1 was deleted") });
    });
});
