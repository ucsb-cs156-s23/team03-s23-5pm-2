import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import EnergyDrinkEditPage from "main/pages/Energy Drinks/EnergyDrinkEditPage";
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
    useParams: () => ({
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

const mockUpdate = jest.fn();
jest.mock('main/utils/energydrinkUtils', () => {
    return {
        __esModule: true,
        energydrinkUtils: {
            update: (_energydrink) => { return mockUpdate(); },
            getById: (_id) => {
                return {
                    energydrink: {
                        id: 3,
                        name: "C4",
                        caffeine: "some mock caffeine content",
                        description: "some mock description"
                    }
                }
            }
        }
    }
});


describe("EnergyDrinkEditPage tests", () => {
    const axiosMock =new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither); 
    const queryClient = new QueryClient();

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <EnergyDrinkEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <EnergyDrinkEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByTestId("EnergyDrinkForm-name")).toBeInTheDocument();
        expect(screen.getByDisplayValue('C4')).toBeInTheDocument();
        expect(screen.getByDisplayValue('some mock caffeine content')).toBeInTheDocument();
        expect(screen.getByDisplayValue('some mock description')).toBeInTheDocument();
    });

    test("redirects to /energydrinks on submit", async () => {

        const restoreConsole = mockConsole();

        mockUpdate.mockReturnValue({
            "energydrink": {
                id: 3,
                name: "C4",
                caffeine: "some mock caffeine content",
                description: "some mock description"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <EnergyDrinkEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();

        const caffeineInput = screen.getByLabelText("Caffeine");
        expect(caffeineInput).toBeInTheDocument();

        const descriptionInput = screen.getByLabelText("Description");
        expect(descriptionInput).toBeInTheDocument();

        const updateButton = screen.getByText("Update");
        expect(updateButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'C4' } })
            fireEvent.change(caffeineInput, { target: { value: 'some mock caffeine content' } })
            fireEvent.change(descriptionInput, { target: { value: 'some mock description' } })
            fireEvent.click(updateButton);
        });

        await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/energydrinks"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `updatedEnergyDrink: {"energydrink":{"id":3,"name":"C4","caffeine":"some mock caffeine content","description":"some mock description"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});