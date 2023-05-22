import { fireEvent, render, waitFor } from "@testing-library/react";
import { energydrinkFixtures } from "fixtures/energydrinkFixtures";
import EnergyDrinkTable from "main/components/EnergyDrinks/EnergyDrinkTable";
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
          <EnergyDrinkTable energyDrinks={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });
  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EnergyDrinkTable energyDrinks={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EnergyDrinkTable energyDrinks={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("Has the expected column headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EnergyDrinkTable energyDrinks={energydrinkFixtures.threeEnergyDrinks} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["id", "Name", "Caffeine", "Description"];
    const expectedFields = ["id", "name", "caffeine", "description"];
    const testId = "EnergyDrinkTable";

    expectedHeaders.forEach((headerText) => {
      const header = getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");//1
    expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3"); //2
    expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4"); //3

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
          <EnergyDrinkTable energyDrinks={energydrinkFixtures.threeEnergyDrinks} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => { expect(getByTestId(`EnergyDrinkTable-cell-row-0-col-id`)).toHaveTextContent("2"); })//1;

    const editButton = getByTestId(`EnergyDrinkTable-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/energydrinks/edit/2'));//1

  });

  test("detail page button test", async () => {
    const currentUser = currentUserFixtures.adminUser;

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EnergyDrinkTable energyDrinks={energydrinkFixtures.threeEnergyDrinks} currentUser={currentUser} actionVisible={true} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const detailButton = getByTestId("EnergyDrinkTable-cell-row-0-col-Detail-button");
    fireEvent.click(detailButton);
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/energydrinks/detail/2')); //1
  });

});