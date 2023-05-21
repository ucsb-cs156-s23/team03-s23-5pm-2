import {render, waitFor } from "@testing-library/react";
import EnergyDrinkDetailsPage from "main/pages/EnergyDrinks/EnergyDrinkDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";
import * as backendModule from "main/utils/useBackend";

const ENERGY_DRINKS_TABLE_TEST_ID = "EnergyDrinkTable";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 3
    }),
    useNavigate: (x) => { mockNavigate(x); return null; },
}));

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});




describe("EnergyDrinkDetailsPage tests", () => {
    const axiosMock =new AxiosMockAdapter(axios);

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

    test("loads the correct fields, and no buttons, not admin", async ()=>{
        setupUserOnly();
        const queryClient = new QueryClient();
        const drink =  {
            "id": 3,
            "name": "Celsius",
            "caffeine": "200 mg",
            "description": "CELSIUS is a fitness drink."
        }

        axiosMock.onGet("/api/energydrinks?id=3").reply(202, drink);

        const { getByTestId, queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <EnergyDrinkDetailsPage />
            </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => { expect(getByTestId(`${ENERGY_DRINKS_TABLE_TEST_ID}-cell-row-0-col-id`)).toHaveTextContent("3"); });
        expect(getByTestId(`${ENERGY_DRINKS_TABLE_TEST_ID}-cell-row-0-col-name`)).toHaveTextContent("Celsius");
        expect(getByTestId(`${ENERGY_DRINKS_TABLE_TEST_ID}-cell-row-0-col-caffeine`)).toHaveTextContent("200 mg");
        expect(getByTestId(`${ENERGY_DRINKS_TABLE_TEST_ID}-cell-row-0-col-description`)).toHaveTextContent("CELSIUS is a fitness drink.");
        expect(queryByTestId(`${ENERGY_DRINKS_TABLE_TEST_ID}-cell-row-0-col-Detail-button`)).not.toBeInTheDocument();
        expect(queryByTestId(`${ENERGY_DRINKS_TABLE_TEST_ID}-cell-row-0-col-Edit-button`)).not.toBeInTheDocument();
        expect(queryByTestId(`${ENERGY_DRINKS_TABLE_TEST_ID}-cell-row-0-col-Delete-button`)).not.toBeInTheDocument();
    });

    test("loads the correct fields, and no buttons, admin user", async ()=>{
        setupAdminUser();
        const queryClient = new QueryClient();
        const drink =  {
            "id": 3,
            "name": "Celsius",
            "caffeine": "200 mg",
            "description": "CELSIUS is a fitness drink."
        }

        axiosMock.onGet("/api/energydrinks?id=3").reply(202, drink);

        const { getByTestId, queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <EnergyDrinkDetailsPage />
            </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => { expect(getByTestId(`${ENERGY_DRINKS_TABLE_TEST_ID}-cell-row-0-col-id`)).toHaveTextContent("3"); });
        expect(getByTestId(`${ENERGY_DRINKS_TABLE_TEST_ID}-cell-row-0-col-name`)).toHaveTextContent("Celsius");
        expect(getByTestId(`${ENERGY_DRINKS_TABLE_TEST_ID}-cell-row-0-col-caffeine`)).toHaveTextContent("200 mg");
        expect(getByTestId(`${ENERGY_DRINKS_TABLE_TEST_ID}-cell-row-0-col-description`)).toHaveTextContent("CELSIUS is a fitness drink.");
        expect(queryByTestId(`${ENERGY_DRINKS_TABLE_TEST_ID}-cell-row-0-col-Detail-button`)).not.toBeInTheDocument();
        expect(queryByTestId(`${ENERGY_DRINKS_TABLE_TEST_ID}-cell-row-0-col-Edit-button`)).not.toBeInTheDocument();
        expect(queryByTestId(`${ENERGY_DRINKS_TABLE_TEST_ID}-cell-row-0-col-Delete-button`)).not.toBeInTheDocument();
    });

    test("toast error notification and console error message when id doesn't exit in database", async ()=> {
        setupUserOnly();
        const queryClient = new QueryClient();
        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <EnergyDrinkDetailsPage />
            </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });
        
        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/energydrinks?id=3");
        restoreConsole();

        expect(mockToast).toBeCalled();
        expect(mockToast).toHaveBeenCalledWith("Error communicating with backend via GET on /api/energydrinks?id=3");
    });

    test('useBackend params are correct', async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        const useBackendSpyFunc = jest.spyOn(backendModule, 'useBackend');

        const drink =  {
            "id": 3,
            "name": "Celsius",
            "caffeine": "200 mg",
            "description": "CELSIUS is a fitness drink."
        }

        axiosMock.onGet("/api/energydrinks?id=3").reply(202, drink);

        render(
            <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <EnergyDrinkDetailsPage />
            </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });
        expect(useBackendSpyFunc).toBeCalled();
        expect(useBackendSpyFunc).toBeCalledWith( ["/api/energydrinks/detail/3"], { method: "GET", url: `/api/energydrinks?id=3`}, []);
    });


});

