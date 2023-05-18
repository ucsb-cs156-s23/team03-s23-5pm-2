import { onDeleteSuccess, cellToAxiosParamsDelete, editCallback } from "main/utils/bookUtils";
import mockConsole from "jest-mock-console";
import {toast} from 'react-toastify';


const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: {
            success: jest.fn(),
        }
    };
});

describe("BookUtils", () => {

    describe("onDeleteSuccess", () => {

        test("It puts the message on console.log and in a toast", () => {
            // arrange
            const restoreConsole = mockConsole();

            // act
            onDeleteSuccess({message: "abc"});

            // assert
            expect(toast.success).toHaveBeenCalledWith("abc");
            expect(console.log).toHaveBeenCalled();
            const message = console.log.mock.calls[0][0];
            expect(message).toMatch("abc");

            restoreConsole();
        });

    });
    describe("cellToAxiosParamsDelete", () => {

        test("It returns the correct params", () => {
            // arrange
            const cell = { row: { values: { id: 17 } } };

            // act
            const result = cellToAxiosParamsDelete(cell);


            // assert
            expect(result).toEqual({
                url: "/api/books",
                method: "DELETE",
                params: { id: 17 }
            });
        });

    });
});





