import { render, waitFor, fireEvent } from "@testing-library/react";
import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";


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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("EnergyDrinkCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <EnergyDrinkCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const energyDrink = {
            id: 17,
            name: "RedBull Dupe",
            caffeine: "8000 mg",
            description: "Dupe of redbull, perfect for finals"
        };

        axiosMock.onPost("/api/energydrinks/post").reply( 202, ucsbDate );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <EnergyDrinkCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("EnergyDrinkForm-name")).toBeInTheDocument();
        });

        const nameField = getByTestId("EnergyDrinkForm-name");
        const caffeineField = getByTestId("EnergyDrinkForm-caffeine");
        const descriptionField = getByTestId("EnergyDrinkForm-description");
        const submitButton = getByTestId("EnergyDrinkForm-submit");

        fireEvent.change(nameField, { target: { value: 'Random Energy Drink name' } });
        fireEvent.change(caffeineField, { target: { value: '120 mg' } });
        fireEvent.change(descriptionField, { target: { value: 'This is a description of a Random Energy Drink' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "description": "RandDrink is very good for you, better than RedBull",
            "caffeine": "6000 mg",
            "name": "RandDrink"
        });

        expect(mockToast).toBeCalledWith("New energyDrink Created - id: 17 name: Redbull Dupe");
        expect(mockNavigate).toBeCalledWith({ "to": "/energydrinks/list" });
    });


});


