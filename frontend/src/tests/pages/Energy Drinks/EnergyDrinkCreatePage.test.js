import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import EnergyDrinkCreatePage from "main/pages/Energy Drinks/EnergyDrinkCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockAdd = jest.fn();
jest.mock('main/utils/energydrinkUtils', () => {
    return {
        __esModule: true,
        energydrinkUtils: {
            add: () => { return mockAdd(); }
        }
    }
});

describe("EnergyDrinkCreatePage tests", () => {
    const axiosMock =new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither); 

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <EnergyDrinkCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("redirects to /energydrinks on submit", async () => {

        const restoreConsole = mockConsole();

        mockAdd.mockReturnValue({
            "energydrink": {
                id: 3,
                name: "some mock name",
                caffeine: "some mock caffeine content",
                description: "some mock description"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <EnergyDrinkCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();

        const caffeineInput = screen.getByLabelText("Caffeine");
        expect(caffeineInput).toBeInTheDocument();

        const descriptionInput = screen.getByLabelText("Description");
        expect(descriptionInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'some mock name' } })
            fireEvent.change(caffeineInput, { target: { value: 'some mock caffeine content' } })
            fireEvent.change(descriptionInput, { target: { value: 'some mock description' } })
            fireEvent.click(createButton);
        });

        await waitFor(() => expect(mockAdd).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/energydrinks"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `createdEnergyDrink: {"energydrink":{"id":3,"name":"some mock name","caffeine":"some mock caffeine content","description":"some mock description"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});