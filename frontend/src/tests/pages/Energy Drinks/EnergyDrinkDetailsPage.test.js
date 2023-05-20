import { fireEvent, render, screen } from "@testing-library/react";
import EnergyDrinkDetailsPage from "main/pages/Energy Drinks/EnergyDrinkDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
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

jest.mock('main/utils/energydrinkUtils', () => {
    return {
        __esModule: true,
        energydrinkUtils: {
            getById: (_id) => {
                return {
                    energydrink: {
                        id: 3,
                        name: "Rockstar",
                        caffeine: "160",
                        description: "Rockstar is an energy drink created in 2001, which, as of 2020, has a 10% market share of the global energy drink market; the third-highest after Red Bull and Monster Energy. Rockstar is based in Purchase, New York.",
                    }
                }
            }
        }
    }
});

describe("EnergyDrinkDetailsPage tests", () => {
    const axiosMock =new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither); 

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <EnergyDrinkDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields, and no buttons", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <EnergyDrinkDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(screen.getByText("Rockstar")).toBeInTheDocument();
        expect(screen.getByText("Rockstar is an energy drink created in 2001, which, as of 2020, has a 10% market share of the global energy drink market; the third-highest after Red Bull and Monster Energy. Rockstar is based in Purchase, New York.")).toBeInTheDocument();

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

});

