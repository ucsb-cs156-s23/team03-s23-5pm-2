import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { EnergyDrinkForm } from "main/components/Energy Drinks/EnergyDrinkForm";
import { energydrinkFixtures } from "fixtures/energydrinkFixtures";
import { BrowserRouter as Router } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("EnergyDrinkForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Name","Caffeine", "Description"];
    const testId = "EnergyDrinkForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <EnergyDrinkForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
          });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <EnergyDrinkForm initialContents={energydrinkFixtures.oneEnergyDrink} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
    });

    test("Correct Error messsages on bad input", async () => {

        const { getByTestId, getByText, findByTestId, findByText } = render(
            <Router  >
                <EnergyDrinkForm />
            </Router>
        );
        await findByTestId("EnergyDrinkForm-name");
        const nameField = getByTestId("EnergyDrinkForm-name");
        const caffeineField = getByTestId("EnergyDrinkForm-caffeine");
        const submitButton = getByTestId("EnergyDrinkForm-submit");

        fireEvent.change(nameField, { target: { value: 'bad-input' } });
        fireEvent.change(caffeineField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await findByText(/Name must be formatted/);
        expect(getByText(/caffeine must be formatted/)).toBeInTheDocument();
    });

    test("Correct Error messsages on missing input", async () => {

        const { getByTestId, getByText, findByTestId, findByText } = render(
            <Router  >
                <EnergyDrinkForm />
            </Router>
        );
        await findByTestId("EnergyDrinkForm-submit");
        const submitButton = getByTestId("EnergyDrinkForm-submit");

        fireEvent.click(submitButton);

        await findByText(/Name is required./);
        expect(getByText(/Caffeine is required./)).toBeInTheDocument();
        expect(getByText(/Description is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        const { getByTestId, queryByText, findByTestId } = render(
            <Router  >
                <EnergyDrinkForm submitAction={mockSubmitAction} />
            </Router>
        );
        await findByTestId("EnergyDrinkForm-name");

        const nameField = getByTestId("UCSBDateForm-quarterYYYYQ");
        const caffeineField = getByTestId("UCSBDateForm-name");
        const descriptionField = getByTestId("UCSBDateForm-localDateTime");
        const submitButton = getByTestId("UCSBDateForm-submit");

        fireEvent.change(nameField, { target: { value: 'Good Energy Drink' } });
        fireEvent.change(caffeineField, { target: { value: '1200 mg' } });
        fireEvent.change(descriptionField, { target: { value: 'Energy Drink from the heavens above' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(queryByText(/Name must be formatted/)).not.toBeInTheDocument();
        expect(queryByText(/Caffeine must be formatted/)).not.toBeInTheDocument();

    });



    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <EnergyDrinkForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

});