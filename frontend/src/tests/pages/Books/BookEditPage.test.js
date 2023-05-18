import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import BookEditPage from "main/pages/Books/BookEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { toast } from 'react-toastify';
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

const BOOK_FORM_TEST_ID = "BookForm";

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

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("BookEditPage tests", () => {
    describe("when the backend doesn't return a todo", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/books", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            const { queryByTestId, findByText} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <BookEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit Book");
            expect(queryByTestId(`${BOOK_FORM_TEST_ID}-title`)).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {
        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/books", { params: { id: 17 } }).reply(200, {
                id: 17,
                title: 'some test title 17',
                author: 'some test author 17',
                date: '2019-03-25'
            });
            axiosMock.onPut('/api/books').reply(200, {
                id: "17",
                title: 'some test title 19',
                author: 'some test author 19',
                date: '2023-02-25'
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <BookEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <BookEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId(`${BOOK_FORM_TEST_ID}-title`);

            const idField = getByTestId(`${BOOK_FORM_TEST_ID}-id`);
            const titleField = getByTestId(`${BOOK_FORM_TEST_ID}-title`);
            const authorField = getByTestId(`${BOOK_FORM_TEST_ID}-author`);
            const dateField = getByTestId(`${BOOK_FORM_TEST_ID}-date`);

            expect(idField).toHaveValue("17");
            expect(titleField).toHaveValue("some test title 17");
            expect(authorField).toHaveValue("some test author 17");
            expect(dateField).toHaveValue("2019-03-25");
        });

        test("Changes when you click Update", async () => {
            const { getByTestId} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <BookEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            const idField = getByTestId(`${BOOK_FORM_TEST_ID}-id`);
            const titleField = getByTestId(`${BOOK_FORM_TEST_ID}-title`);
            const authorField = getByTestId(`${BOOK_FORM_TEST_ID}-author`);
            const dateField = getByTestId(`${BOOK_FORM_TEST_ID}-date`);
            const submitButton = getByTestId(`${BOOK_FORM_TEST_ID}-submit`);

            expect(idField).toHaveValue("17");
            expect(titleField).toHaveValue("some test title 17");
            expect(authorField).toHaveValue("some test author 17");
            expect(dateField).toHaveValue("2019-03-25");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(titleField, {target: {value: 'some test title 19'}});
            fireEvent.change(authorField, {target: {value: 'some test title 19'}});
            fireEvent.change(dateField, {target: {value: '2023-02-25'}});

            fireEvent.click(submitButton);

            await waitFor(() => expect(toast.success).toBeCalled);
            expect(toast.success).toBeCalledWith("Book Updated - id: 17 title: some test title 19");
            expect(mockNavigate).toBeCalledWith({"to": "/books/list"});

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                title: 'some test title 19',
                author: 'some test title 19',
                date: '2023-02-25'
            })); // posted object
        });
    });

});
