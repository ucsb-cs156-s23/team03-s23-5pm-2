import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";
import { energydrinkFixtures } from "fixtures/energydrinkFixtures";
import EnergyDrinkIndexPage from "main/pages/EnergyDrinks/EnergyDrinkIndexPage";


const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("EnergyDrinkIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "EnergyDrinkTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    test("renders without crashing for regular user", () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/energydrinks/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <EnergyDrinkIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );


    });

    test("renders without crashing for admin user", () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/energydrinks/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <EnergyDrinkIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );


    });

    test("renders three energy drinks without crashing for regular user", async () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/energydrinks/all").reply(200, energydrinkFixtures.threeEnergyDrinks);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <EnergyDrinkIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2"); });//1
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3"); //2
        expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");//3

    });

    test("renders three energy drinks without crashing for admin user", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/energydrinks/all").reply(200, energydrinkFixtures.threeEnergyDrinks);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <EnergyDrinkIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2"); }); //1
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3"); //2
        expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4"); //3

    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/energydrinks/all").timeout();

        const restoreConsole = mockConsole();

        const { queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <EnergyDrinkIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/energydrinks/all");
        restoreConsole();

        expect(queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
    });

    // test("what happens when you click delete, admin", async () => {
    //     setupAdminUser();

    //     const queryClient = new QueryClient();
    //     axiosMock.onGet("/api/energydrinks/all").reply(200, energydrinkFixtures.threeEnergyDrinks);
    //     axiosMock.onDelete("/api/energydrinks").reply(200, "EnergyDrink with id 1 was deleted");


    //     const { getByTestId } = render(
    //         <QueryClientProvider client={queryClient}>
    //             <MemoryRouter>
    //                 <EnergyDrinkIndexPage />
    //             </MemoryRouter>
    //         </QueryClientProvider>
    //     );

    //     await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

    //     expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");


    //     const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    //     expect(deleteButton).toBeInTheDocument();

    //     fireEvent.click(deleteButton);

    //     await waitFor(() => { expect(mockToast).toBeCalledWith("EnergyDrink with id 1 was deleted") });
    // });

});