import { fireEvent, queryByTestId, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { EnergyDrinkEditPage } from "main/pages/Energy Drinks/EnergyDrinkEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("EnergyDrinkEditPage tests", () => {

    describe("when the backend doesn't return a todo", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/energydrinks", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            const {getByText, queryByTestId, findByText} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <EnergyDrinkEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit EnergyDrink");
            expect(queryByTestId("EnergyDrinkForm-name")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/energydrinks", { params: { id: 17 } }).reply(200, {
                id: 17,
                name: 'Gatorade Extreme',
                caffeine: "100mg",
                description: "A really good energy drink, gatorade with max caffeine"
            });
            axiosMock.onPut('/api/energydrinks').reply(200, {
                id: "17",
                name: 'Energy boba',
                caffeine: "100mg",
                description: "Energy drink boba for boba enthusiasts"
            });
        });

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

        test("Is populated with the data provided", async () => {

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <EnergyDrinkEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("EnergyDrinkForm-name");

            const idField = getByTestId("EnergyDrinkForm-id");
            const nameField = getByTestId("EnergyDrinkForm-name");
            const caffeineField = getByTestId("EnergyDrinkForm-caffeine");
            const descriptionField = getByTestId("EnergyDrinkForm-description");
            const submitButton = getByTestId("EnergyDrinkForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("Energy boba");
            expect(caffeineField).toHaveValue("1000mg");
            expect(descriptionField).toHaveValue("Energy drink boba for boba enthusiasts");
        });

        test("Changes when you click Update", async () => {



            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <EnergyDrinkEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("EnergyDrinkForm-name");

            const idField = getByTestId("EnergyDrinkForm-id");
            const nameField = getByTestId("EnergyDrinkForm-name");
            const caffeineField = getByTestId("EnergyDrinkForm-caffeine");
            const descriptionField = getByTestId("EnergyDrinkForm-description");
            const submitButton = getByTestId("EnergyDrinkForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("Gatorade Extreme");
            expect(caffeineField).toHaveValue("100mg");
            expect(descriptionField).toHaveValue("A really good energy drink, gatorade with max caffeine");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: 'Energy boba' } })
            fireEvent.change(caffeineField, { target: { value: '100mg' } })
            fireEvent.change(descriptionField, { target: { value: "Energy drink boba for boba enthusiasts" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("EnergyDrink Updated - id: 17 name: Energy boba");
            expect(mockNavigate).toBeCalledWith({ "to": "/energydrinks/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                name: 'Energy boba',
                caffeine: "100mg",
                description: "Energy drink boba for boba enthusiasts"
            })); // posted object

        });

       
    });
});


