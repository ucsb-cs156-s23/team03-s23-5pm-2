import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import BookForm from "main/components/Books/BookForm";
import { bookFixtures } from "fixtures/bookFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

// constants
const EXPECTED_HEADERS = ["Title", "Description", "Author", "Date", "Publisher"];
const EXPECTED_BUTTON_TEXT = ["Submit", "Cancel"];
const TEST_ID = "BookForm";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("BookForm tests", () => {
    const queryClient = new QueryClient();

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                   <BookForm/>
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        EXPECTED_HEADERS.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });
        
        // Check if all components are rendered properly in DOM
        [...EXPECTED_HEADERS, ...EXPECTED_BUTTON_TEXT].forEach((text)=> {
            const formComponent = screen.getByTestId(`${TEST_ID}-${text.toLowerCase()}`)
            expect(formComponent).toBeInTheDocument();
        });
    });

    test("check input validations are triggered for react form", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                   <BookForm/>
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        const submitButton = screen.getByTestId(`${TEST_ID}-submit`);
        expect(submitButton).toBeInTheDocument();
        fireEvent.click(submitButton);

        // Check if validations work properly for all required form fields
        await waitFor(() => {
            [...EXPECTED_HEADERS].forEach((text)=>{
                const warningText = screen.getByText(`${text} is required.`);
                expect(warningText).toBeInTheDocument();
            });
        });
    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <BookForm initialContents={bookFixtures.oneBook} />
                </Router>
            </QueryClientProvider>
        );

        expect(screen.getByTestId(`${TEST_ID}-id`)).toBeInTheDocument();
        expect(screen.getByText('Id')).toBeInTheDocument();

        [...EXPECTED_HEADERS, ...EXPECTED_BUTTON_TEXT].forEach((text)=> {
            const formComponent = screen.getByTestId(`${TEST_ID}-${text.toLowerCase()}`)
            expect(formComponent).toBeInTheDocument();
        });
       
    });

    test("renders correctly when passing in initialContents", async () => {
        const testButtonText = "some tests"
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <BookForm buttonLabel={testButtonText} />
                </Router>
            </QueryClientProvider>
        );

        expect(screen.getByText(testButtonText)).toBeInTheDocument();
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                   <BookForm/>
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByTestId(`${TEST_ID}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${TEST_ID}-cancel`);

        fireEvent.click(cancelButton);
        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });
});

