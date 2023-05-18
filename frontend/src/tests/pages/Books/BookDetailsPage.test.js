import { render, screen } from "@testing-library/react";
import BookDetailsPage from "main/pages/Books/BookDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

jest.mock('main/utils/bookUtils', () => {
    return {
        __esModule: true,
        bookUtils: {
            getById: (_id) => {
                return {
                    book: {
                        id: 3,
                        title: "To Kill a Mockingbird",
                        description: "To Kill a Mockingbird is a novel by Harper Lee, published in 1960. It is set in the 1930s in a small town in Alabama and explores themes of racism, injustice, and morality through the eyes of a young girl named Scout Finch.",
                        author: "Harper Lee",
                        date: "1960-07-11",
                        publisher: "J. B. Lippincott & Co."
                    }
                }
            }
        }
    }
});

describe("BookDetailsPage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields, and no buttons", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(screen.getByText("To Kill a Mockingbird")).toBeInTheDocument();
        expect(screen.getByText("To Kill a Mockingbird is a novel by Harper Lee, published in 1960. It is set in the 1930s in a small town in Alabama and explores themes of racism, injustice, and morality through the eyes of a young girl named Scout Finch.")).toBeInTheDocument();

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

});


