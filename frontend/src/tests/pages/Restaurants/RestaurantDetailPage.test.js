import { render, waitFor, screen } from "@testing-library/react";
import RestaurantDetailPage from "main/pages/Restaurants/RestaurantDetailPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import mockConsole from "jest-mock-console";
import * as backendModule from "main/utils/useBackend";
import * as restaurantUtilModule from "main/utils/restaurantUtils";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";


const RESTAURANTS_TABLE_TEST_ID = "RestaurantsTable";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; },
        useParams: () => ({
            id: 15
        }),
    };
});

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("RestaurantDetailPage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);

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

    test("loads the correct fields, and no buttons, not admin", async () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        const restaurant = {
            id: 15,
            name: "some test name",
            description: "some test description"
        }

        axiosMock.onGet("/api/restaurants?id=15").reply(202, restaurant);

        const { getByTestId, queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantDetailPage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => { expect(getByTestId(`${RESTAURANTS_TABLE_TEST_ID}-cell-row-0-col-id`)).toHaveTextContent("15"); });
        expect(getByTestId(`${RESTAURANTS_TABLE_TEST_ID}-cell-row-0-col-name`)).toHaveTextContent("some test name");
        expect(getByTestId(`${RESTAURANTS_TABLE_TEST_ID}-cell-row-0-col-description`)).toHaveTextContent("some test description");
        expect(queryByTestId("RestaurantsTable-cell-row-0-col-Detail-button")).not.toBeInTheDocument();
        expect(queryByTestId("RestaurantsTable-cell-row-0-col-Edit-button")).not.toBeInTheDocument();
        expect(queryByTestId("RestaurantsTable-cell-row-0-col-Delete-button")).not.toBeInTheDocument();
    });

    test("loads the correct fields, and no buttons, admin user", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        const restaurant = {
            id: 15,
            name: "some test name",
            description: "some test description"
        }

        axiosMock.onGet("/api/restaurants?id=15").reply(202, restaurant);

        const { getByTestId, queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantDetailPage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => { expect(getByTestId(`${RESTAURANTS_TABLE_TEST_ID}-cell-row-0-col-id`)).toHaveTextContent("15"); });
        expect(getByTestId(`${RESTAURANTS_TABLE_TEST_ID}-cell-row-0-col-name`)).toHaveTextContent("some test name");
        expect(getByTestId(`${RESTAURANTS_TABLE_TEST_ID}-cell-row-0-col-description`)).toHaveTextContent("some test description");
        expect(queryByTestId("RestaurantsTable-cell-row-0-col-Detail-button")).not.toBeInTheDocument();
        expect(queryByTestId("RestaurantsTable-cell-row-0-col-Edit-button")).not.toBeInTheDocument();
        expect(queryByTestId("RestaurantsTable-cell-row-0-col-Delete-button")).not.toBeInTheDocument();
    });

    test("toast error notification and console error message when id doesn't exit in database", async () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/restaurants?id=15").reply(404, { message: "Restaurant with id 15 not found", type: "EntityNotFoundException" });
        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantDetailPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/restaurants?id=15");
        restoreConsole();

        expect(mockToast).toBeCalled();
        expect(mockToast).toHaveBeenCalledWith("Error communicating with backend via GET on /api/restaurants?id=15");

    });


    test('useBackend params are correct', async () => {
        setupUserOnly();
        const queryClient = new QueryClient();

        const useBackendSpyFunc = jest.spyOn(backendModule, 'useBackend');

        const restaurant = {
            id: 15,
            name: "some test name",
            description: "some test description"
        }

        axiosMock.onGet("/api/restaurants?id=15").reply(202, restaurant);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantDetailPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });
        expect(useBackendSpyFunc).toBeCalled();
        expect(useBackendSpyFunc).toBeCalledWith(["/api/restaurants/detail/15"], { method: "GET", url: `/api/restaurants?id=15` }, []);
    });
});