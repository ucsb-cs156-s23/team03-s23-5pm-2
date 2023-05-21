import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import EnergyDrinkEditPage from "main/pages/EnergyDrinks/EnergyDrinkEditPage";

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

            const { queryByTestId, findByText } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <EnergyDrinkEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit Energy Drink");
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
                name: "some test name 17",
                caffeine: "some test caffeine 17",
                description: "some test description 17"
            });
            axiosMock.onPut('/api/energydrinks').reply(200, {
                id: "17",
                name: "some test name 19",
                //caffeine: "some test caffeine 19",
                description: "some test description 19"
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

            await findByTestId('EnergyDrinkForm-name');

            const idField = getByTestId('EnergyDrinkForm-id');
            const nameField = getByTestId('EnergyDrinkForm-name');
            const caffeineField = getByTestId('EnergyDrinkForm-caffeine');
            const descriptionField = getByTestId('EnergyDrinkForm-description');

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("some test name 17");
            expect(caffeineField).toHaveValue("some test caffeine 17");
            expect(descriptionField).toHaveValue("some test description 17");
        });

        test("Changes when you click Update", async () => {



            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <EnergyDrinkEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            const idField = getByTestId('EnergyDrinkForm-id');
            const nameField = getByTestId('EnergyDrinkForm-name');
            const caffeineField = getByTestId('EnergyDrinkForm-caffeine');
            const descriptionField = getByTestId('EnergyDrinkForm-description');
            const submitButton = getByTestId('EnergyDrinkForm-submit');

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("some test name 17");
            expect(caffeineField).toHaveValue("some test caffeine 17");
            expect(descriptionField).toHaveValue("some test description 17");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: 'some test name 19' } })
            fireEvent.change(caffeineField, { target: { value: "some test caffeine 19" } })
            fireEvent.change(descriptionField, { target: { value: "some test description 19" } })
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("EnergyDrink Updated - id: 17 name: some test name 19");
            expect(mockNavigate).toBeCalledWith({ "to": "/energydrinks/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                name: "some test name 19",
                //caffeine: "some test caffeine 19",
                description: "some test description 19"
            })); // posted object

        });


    });
});

