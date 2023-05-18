import { render, screen, waitFor } from "@testing-library/react";
import EnergyDrinkIndexPage from "main/pages/Energy Drinks/EnergyDrinkIndexPage";
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

const mockDelete = jest.fn();
jest.mock('main/utils/energydrinkUtils', () => {
    return {
        __esModule: true,
        energydrinkUtils: {
            del: (id) => {
                return mockDelete(id);
            },
            get: () => {
                return {
                    nextId: 5,
                    energydrinks: [
                        {
                            "id": 3,
                            "name": "Rockstar",
                            "caffeine": "160",
                            "description": "Rockstar is an energy drink created in 2001, which, as of 2020, has a 10% market share of the global energy drink market; the third-highest after Red Bull and Monster Energy. Rockstar is based in Purchase, New York.",
                        },
                    ]
                }
            }
        }
    }
});


describe("EnergyDrinkIndexPage tests", () => {
    const axiosMock =new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither); 

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <EnergyDrinkIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders correct fields", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <EnergyDrinkIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const createEnergyDrinkButton = screen.getByText("Create Energy Drink");
        expect(createEnergyDrinkButton).toBeInTheDocument();
        expect(createEnergyDrinkButton).toHaveAttribute("style", "float: right;");

        const name = screen.getByText("Rockstar");
        expect(name).toBeInTheDocument();

        const description = screen.getByText("Rockstar is an energy drink created in 2001, which, as of 2020, has a 10% market share of the global energy drink market; the third-highest after Red Bull and Monster Energy. Rockstar is based in Purchase, New York.");
        expect(description).toBeInTheDocument();

        expect(screen.getByTestId("EnergyDrinkTable-cell-row-0-col-Delete-button")).toBeInTheDocument();
        expect(screen.getByTestId("EnergyDrinkTable-cell-row-0-col-Details-button")).toBeInTheDocument();
        expect(screen.getByTestId("EnergyDrinkTable-cell-row-0-col-Edit-button")).toBeInTheDocument();
    });

    test("delete button calls delete and reloads page", async () => {

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <EnergyDrinkIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const name = screen.getByText("Rockstar");
        expect(name).toBeInTheDocument();

        const description = screen.getByText("Rockstar is an energy drink created in 2001, which, as of 2020, has a 10% market share of the global energy drink market; the third-highest after Red Bull and Monster Energy. Rockstar is based in Purchase, New York.");
        expect(description).toBeInTheDocument();

        const deleteButton = screen.getByTestId("EnergyDrinkTable-cell-row-0-col-Delete-button");
        expect(deleteButton).toBeInTheDocument();

        deleteButton.click();

        expect(mockDelete).toHaveBeenCalledTimes(1);
        expect(mockDelete).toHaveBeenCalledWith(3);

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/energydrinks"));


        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `EnergyDrinkIndexPage deleteCallback: {"id":3,"name":"Rockstar","caffeine":"160","description":"Rockstar is an energy drink created in 2001, which, as of 2020, has a 10% market share of the global energy drink market; the third-highest after Red Bull and Monster Energy. Rockstar is based in Purchase, New York."}`;
        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});

