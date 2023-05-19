import { render, waitFor, fireEvent } from "@testing-library/react";
import BookForm from "main/components/Books/BookForm";
import { bookFixtures } from "fixtures/bookFixtures";
import {BrowserRouter as Router} from "react-router-dom";

const BOOK_FORM_TEST_ID = "BookForm";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("BookForm tests", () => {
    test("renders correctly", async ()=>{
        const { findByText } = render(
            <Router>
                <BookForm/>
            </Router>
        );
        await findByText("Title");
        await findByText("Author");
        await findByText("Date");
        await findByText(/Create/);
    });

    test("render correctly when passing in a book", async() => {
        const { getByText, getByTestId, findByTestId } = render(
            <Router  >
                <BookForm initialContents={bookFixtures.oneBook} />
            </Router>
        );

        await findByTestId(`${BOOK_FORM_TEST_ID}-id`);
        await findByTestId(`${BOOK_FORM_TEST_ID}-title`);
        await findByTestId(`${BOOK_FORM_TEST_ID}-author`);
        await findByTestId(`${BOOK_FORM_TEST_ID}-date`);
        expect(getByText(/Id/)).toBeInTheDocument();
        expect(getByText(/Title/)).toBeInTheDocument();
        expect(getByText(/Author/)).toBeInTheDocument();
        expect(getByText(/Date/)).toBeInTheDocument();
        expect(getByTestId(`${BOOK_FORM_TEST_ID}-id`)).toHaveValue(bookFixtures.oneBook.id.toString());
        expect(getByTestId(`${BOOK_FORM_TEST_ID}-title`)).toHaveValue(bookFixtures.oneBook.title);
        expect(getByTestId(`${BOOK_FORM_TEST_ID}-author`)).toHaveValue(bookFixtures.oneBook.author);
        expect(getByTestId(`${BOOK_FORM_TEST_ID}-date`)).toHaveValue(bookFixtures.oneBook.date);
    });

    test("Correct Error messages on missing input", async ()=>{
        const { getByTestId, findByTestId, findByText } = render(
            <Router  >
                <BookForm/>
            </Router>
        );

        await findByTestId(`${BOOK_FORM_TEST_ID}-title`);
        await findByTestId(`${BOOK_FORM_TEST_ID}-author`);
        await findByTestId(`${BOOK_FORM_TEST_ID}-date`);

        const submitButton = getByTestId(`${BOOK_FORM_TEST_ID}-submit`);
        fireEvent.click(submitButton);
        await findByText(/Title is required./);
        await findByText(/Author is required./);
        await findByText(/Date is required./);
    });

    test("No Error messages on bad input", async ()=>{
        const mockSubmitAction = jest.fn();
        const { getByTestId  } = render(
            <Router  >
                <BookForm submitAction={mockSubmitAction} />
            </Router>
        );
        
        const titleField = getByTestId(`${BOOK_FORM_TEST_ID}-title`);
        const authorField = getByTestId(`${BOOK_FORM_TEST_ID}-author`);
        const dateField = getByTestId(`${BOOK_FORM_TEST_ID}-date`);
        const submitButton = getByTestId(`${BOOK_FORM_TEST_ID}-submit`);

        fireEvent.change(titleField, {target: {value: 'some title'}});
        fireEvent.change(authorField, {target: {value: 'some author'}});
        fireEvent.change(dateField, {target: {value: 'some bad date'}});
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).not.toHaveBeenCalled());
    });

    test("No Error messages on good input", async ()=>{
        const mockSubmitAction = jest.fn();
        const { getByTestId, queryByText  } = render(
            <Router  >
                <BookForm submitAction={mockSubmitAction} />
            </Router>
        );
        
        const titleField = getByTestId(`${BOOK_FORM_TEST_ID}-title`);
        const authorField = getByTestId(`${BOOK_FORM_TEST_ID}-author`);
        const dateField = getByTestId(`${BOOK_FORM_TEST_ID}-date`);
        const submitButton = getByTestId(`${BOOK_FORM_TEST_ID}-submit`);

        fireEvent.change(titleField, {target: {value: 'some title'}});
        fireEvent.change(authorField, {target: {value: 'some author'}});
        fireEvent.change(dateField, {target: {value: '2023-05-16'}});
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
        expect(queryByText(/Title is required./)).not.toBeInTheDocument();
        expect(queryByText(/Author is required./)).not.toBeInTheDocument();
        expect(queryByText(/Date is required./)).not.toBeInTheDocument();
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {

        const { getByTestId, findByTestId } = render(
            <Router  >
                <BookForm />
            </Router>
        );

        await findByTestId(`${BOOK_FORM_TEST_ID}-cancel`);
        const cancelButton = getByTestId(`${BOOK_FORM_TEST_ID}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });
});