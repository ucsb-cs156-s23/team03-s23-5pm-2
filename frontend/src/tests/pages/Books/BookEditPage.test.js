import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import BookEditPage from "main/pages/Books/BookEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";


const INPUT_HEADER = ["title", "description", "author", "date", "publisher"];

const mockBookObject = {
    id: 3,
    title: "some mock title",
    description: "some mock description",
    author: "some mock author",
    date: "2023-04-27",
    publisher: "some mock publisher"
}

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

const mockUpdate = jest.fn();
jest.mock('main/utils/bookUtils', () => {
    return {
        __esModule: true,
        bookUtils: {
            update: (_book) => {return mockUpdate();},
            getById: (_id) => {
                return {
                    book: mockBookObject
                }
            }
        }
    }
});


describe("BookEditPage tests", () => {
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

    test("loads the correct fields", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        INPUT_HEADER.forEach((headerText)=>{
            expect(screen.getByTestId(`BookForm-${headerText}`)).toBeInTheDocument();
        })
        expect(screen.getByDisplayValue('some mock title')).toBeInTheDocument();
        expect(screen.getByDisplayValue('some mock description')).toBeInTheDocument();
        expect(screen.getByDisplayValue('some mock author')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2023-04-27')).toBeInTheDocument();
        expect(screen.getByDisplayValue('some mock publisher')).toBeInTheDocument();
    });

    test("redirects to /books on submit", async () => {

        const restoreConsole = mockConsole();

        mockUpdate.mockReturnValue({
            "book": mockBookObject
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const titleInput = screen.getByLabelText("Title");
        expect(titleInput).toBeInTheDocument();

        const descriptionInput = screen.getByLabelText("Description");
        expect(descriptionInput).toBeInTheDocument();

        const authorInput = screen.getByLabelText("Author");
        expect(authorInput).toBeInTheDocument();

        const datePicker = screen.getByLabelText("Date");
        expect(datePicker).toBeInTheDocument();

        const publisherInput = screen.getByLabelText("Publisher");
        expect(publisherInput).toBeInTheDocument();

        const updateButton = screen.getByText("Update");
        expect(updateButton).toBeInTheDocument();

        const cancelButton = screen.getByText("Cancel");
        expect(cancelButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(titleInput, { target: { value: 'some mock title' } })
            fireEvent.change(descriptionInput, { target: { value: 'some mock description' } })
            fireEvent.change(authorInput, { target: { value: 'some mock author' } })
            fireEvent.change(datePicker, { target: { value: '2023-04-27' } })
            fireEvent.change(publisherInput, { target: { value: 'some mock publisher' } })
            fireEvent.click(updateButton);
        });

        await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/books"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0] + console.log.mock.calls[0][1];
        const expectedMessage =  `updatedBook: {"book":{"id":3,"title":"some mock title","description":"some mock description","author":"some mock author","date":"2023-04-27","publisher":"some mock publisher"}`;

        expect(message).toMatch(expectedMessage);
        restoreConsole();
    });
});

