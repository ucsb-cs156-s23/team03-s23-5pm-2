import { fireEvent, render, waitFor } from "@testing-library/react";
import { bookFixtures } from "fixtures/bookFixtures";
import BookTable from "main/components/Books/BookTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("UserTable tests", () => {
    const queryClient = new QueryClient();

    test("renders without crashing for empty table with user not logged in", () => {
        const currentUser = null;
    
        render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <BookTable books={[]} currentUser={currentUser} />
            </MemoryRouter>
          </QueryClientProvider>
        );
    });

    test("renders without crashing for empty table for ordinary user", () => {
        const currentUser = currentUserFixtures.userOnly;
    
        render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <BookTable books={[]} currentUser={currentUser} />
            </MemoryRouter>
          </QueryClientProvider>
        );
    });

    test("renders without crashing for empty table for admin", () => {
        const currentUser = currentUserFixtures.adminUser;
    
        render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <BookTable books={[]} currentUser={currentUser} />
            </MemoryRouter>
          </QueryClientProvider>
    
        );
    });

    test("Has the expected colum headers and content for adminUser", () => {

        const currentUser = currentUserFixtures.adminUser;
    
        const { getByText, getByTestId } = render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <BookTable books={bookFixtures.threeBooks} currentUser={currentUser} />
            </MemoryRouter>
          </QueryClientProvider>
    
        );
    
        const expectedHeaders = ["id", "Title", "Author", "Date"];
        const expectedFields = ["id", "title", "author", "date"];
        const testId = "BooksTable";
    
        expectedHeaders.forEach((headerText) => {
          const header = getByText(headerText);
          expect(header).toBeInTheDocument();
        });
    
        expectedFields.forEach((field) => {
          const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
          expect(header).toBeInTheDocument();
        });
    
        expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");
    
        const editButton = getByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();
        expect(editButton).toHaveClass("btn-primary");
    
        const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toHaveClass("btn-danger");
      });

    test("Edit button navigates to the edit page for admin user", async () => {

      const currentUser = currentUserFixtures.adminUser;

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <BookTable books={bookFixtures.threeBooks} currentUser={currentUser} />
            </MemoryRouter>
            </QueryClientProvider>

        );

        await waitFor(() => { expect(getByTestId(`BooksTable-cell-row-0-col-id`)).toHaveTextContent("1"); });
    
        const editButton = getByTestId(`BooksTable-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();
        
        fireEvent.click(editButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/books/edit/1'));

    });

    test("crud operation buttons no render when actionInVisible is false", ()=>{
        const currentUser = currentUserFixtures.adminUser;
        const testId = "BooksTable";

        const { getByTestId, queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <BookTable books={bookFixtures.threeBooks} currentUser={currentUser} actionVisible={false} />
            </MemoryRouter>
            </QueryClientProvider>
        );

        expect(queryByTestId("BooksTable-cell-row-0-col-Detail-button")).not.toBeInTheDocument();
        expect(queryByTestId("BooksTable-cell-row-0-col-Edit-button")).not.toBeInTheDocument();
        expect(queryByTestId("BooksTable-cell-row-0-col-Delete-button")).not.toBeInTheDocument();
        expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");
        expect(getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("Unbroken: A World War II Story of Survival, Resilience, and Redemption");
        expect(getByTestId(`${testId}-cell-row-1-col-title`)).toHaveTextContent("The Wright Brothers");
        expect(getByTestId(`${testId}-cell-row-2-col-title`)).toHaveTextContent("Into the Wild");
    });

    test("crud operation buttons render when actionInVisible is true", ()=>{
      const currentUser = currentUserFixtures.adminUser;
      const testId = "BooksTable";

      const { getByTestId } = render(
          <QueryClientProvider client={queryClient}>
          <MemoryRouter>
              <BookTable books={bookFixtures.threeBooks} currentUser={currentUser} actionVisible={true} />
          </MemoryRouter>
          </QueryClientProvider>
      );

      expect(getByTestId("BooksTable-cell-row-0-col-Detail-button")).toBeInTheDocument();
      expect(getByTestId("BooksTable-cell-row-0-col-Edit-button")).toBeInTheDocument();
      expect(getByTestId("BooksTable-cell-row-0-col-Delete-button")).toBeInTheDocument();
      expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
      expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
      expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");
      expect(getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("Unbroken: A World War II Story of Survival, Resilience, and Redemption");
      expect(getByTestId(`${testId}-cell-row-1-col-title`)).toHaveTextContent("The Wright Brothers");
      expect(getByTestId(`${testId}-cell-row-2-col-title`)).toHaveTextContent("Into the Wild");
  });

  test("detail page button test", async ()=>{
    const currentUser = currentUserFixtures.adminUser;

    const { getByTestId } = render(
        <QueryClientProvider client={queryClient}>
        <MemoryRouter>
            <BookTable books={bookFixtures.threeBooks} currentUser={currentUser} actionVisible={true} />
        </MemoryRouter>
        </QueryClientProvider>
    );

    const detailButton = getByTestId("BooksTable-cell-row-0-col-Detail-button");
    fireEvent.click(detailButton);
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/books/detail/1'));
  });
});
