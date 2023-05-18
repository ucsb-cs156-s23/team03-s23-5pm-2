import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import BookCreatePage from "main/pages/Books/BookCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from 'react-router-dom';
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockAdd = jest.fn();
jest.mock('main/utils/bookUtils', () => {
    return {
        __esModule: true,
        bookUtils: {
            add: () => { return mockAdd(); }
        }
    }
});

describe("BookCreatePage tests", () => {
    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("redirects to /books on submit", async () => {

        const restoreConsole = mockConsole();

        mockAdd.mockReturnValue({
            "book": {
                id: 3,
                title: "some mock title",
                description: "some mock description",
                author: "some mock author",
                date: "2023-04-27",
                publisher: "some mock publisher"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Title");
        expect(nameInput).toBeInTheDocument();


        const descriptionInput = screen.getByLabelText("Description");
        expect(descriptionInput).toBeInTheDocument();

        const authorInput = screen.getByLabelText("Author");
        expect(authorInput).toBeInTheDocument();

        const datePicker = screen.getByLabelText("Date");
        expect(datePicker).toBeInTheDocument();

        const publisherInput = screen.getByLabelText("Publisher");
        expect(publisherInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'some mock title' } })
            fireEvent.change(descriptionInput, { target: { value: 'some mock description' } })
            fireEvent.change(authorInput, { target: { value: 'some mock author' } })
            fireEvent.change(datePicker, { target: { value: '2023-04-27' } })
            fireEvent.change(publisherInput, { target: { value: 'some mock publisher' } })
            fireEvent.click(createButton);
        });

        await waitFor(() => expect(mockAdd).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/books"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0] + console.log.mock.calls[0][1];
        const expectedMessage = `createdBook: {"book":{"id":3,"title":"some mock title","description":"some mock description","author":"some mock author","date":"2023-04-27","publisher":"some mock publisher"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();
    });
});