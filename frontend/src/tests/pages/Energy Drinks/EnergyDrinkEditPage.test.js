import { render, waitFor, fireEvent } from "@testing-library/react";
import EnergyDrinkForm from "main/components/Energy Drinks/EnergyDrinkForm";
import { energydrinkFixtures } from "fixtures/energydrinkFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("EnergyDrinkForm tests", () => {

    test("renders correctly", async () => {

        const { getByText, findByText } = render(
            <Router  >
                <EnergyDrinkForm />
            </Router>
        );
        await findByText(/Name/);
        await findByText(/Create/);
    });


    // test("renders correctly when passing in an EnergyDrink", async () => {

    //     const { getByText, getByTestId, findByTestId } = render(
    //         <Router  >
    //             <EnergyDrinkForm initialEnergyDrink={energydrinkFixtures.oneEnergyDrink} />
    //         </Router>
    //     );
    //     await findByTestId(/EnergyDrink-id/);
    //     expect(getByText(/Id/)).toBeInTheDocument();
    //     expect(getByTestId(/EnergyDrink-id/)).toHaveValue("1");
    // });


    // test("Correct Error messsages on bad input", async () => {

    //     const { getByTestId, getByText, findByTestId, findByText } = render(
    //         <Router  >
    //             <EnergyDrinkForm />
    //         </Router>
    //     );
    //     await findByTestId("EnergyDrinkForm-name");
    //     const nameField = getByTestId("EnergyDrinkForm-name");
    //     const caffeineField = getByTestId("EnergyDrinkForm-caffeine");
    //     const submitButton = getByTestId("EnergyDrinkForm-submit");

    //     fireEvent.change(nameField, { target: { value: 'bad-input' } });
    //     fireEvent.change(caffeineField, { target: { value: 'bad-input' } });
    //     fireEvent.click(submitButton);

    //     await findByText(/Name must be formatted/);
    //     expect(getByText(/Caffeine must be formatted/)).toBeInTheDocument();
    // });

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

        const nameField = getByTestId("EnergyDrinkForm-name");
        const caffeineField = getByTestId("EnergyDrinkForm-caffeine");
        const descriptionField = getByTestId("EnergyDrinkForm-description");
        const submitButton = getByTestId("EnergyDrinkForm-submit");

        fireEvent.change(nameField, { target: { value: '20221' } });
        fireEvent.change(caffeineField, { target: { value: 'noon on January 2nd' } });
        fireEvent.change(descriptionField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(queryByText(/Name must be formatted/)).not.toBeInTheDocument();
        expect(queryByText(/Caffeine must be formatted/)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        const { getByTestId, findByTestId } = render(
            <Router  >
                <EnergyDrinkForm />
            </Router>
        );
        await findByTestId("EnergyDrinkForm-cancel");
        const cancelButton = getByTestId("EnergyDrinkForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});