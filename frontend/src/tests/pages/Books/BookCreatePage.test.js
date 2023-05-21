import { render, waitFor, fireEvent } from "@testing-library/react";
import BookCreatePage from "main/pages/Books/BookCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import { toast } from 'react-toastify';
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("BookCreatePage tests", () => {
    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async ()=>{
        const queryClient = new QueryClient();
        const book = {
            id: 15,
            title: "some test title",
            author: "some test author",
            date: "2023-04-17"
        }

        axiosMock.onPost("/api/books/post").reply(202, book);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <BookCreatePage />
            </MemoryRouter>
            </QueryClientProvider>
        )

        const titleField = getByTestId(`${BOOK_FORM_TEST_ID}-title`);
        const authorField = getByTestId(`${BOOK_FORM_TEST_ID}-author`);
        const dateField = getByTestId(`${BOOK_FORM_TEST_ID}-date`);
        const submitButton = getByTestId(`${BOOK_FORM_TEST_ID}-submit`);
    
        fireEvent.change(titleField, {target: {value: 'some test title'}});
        fireEvent.change(authorField, {target: {value: 'some test author'}});
        fireEvent.change(dateField, {target: {value: '2020-04-17'}});

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);
        await waitFor(()=> expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            "title": "some test title",
            "author": "some test author",
            "date": "2020-04-17"
        });

        expect(toast.success).toBeCalledWith("New Book Created - id: 15 title: some test title");
        expect(mockNavigate).toBeCalledWith({"to": "/books/list"});
    });
});
