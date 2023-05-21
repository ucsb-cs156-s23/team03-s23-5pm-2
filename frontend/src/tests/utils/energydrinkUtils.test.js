import { energydrinkFixtures } from "fixtures/energydrinkFixtures";
import { energydrinkUtils } from "main/utils/energydrinkUtils";
import { onDeleteSuccess, cellToAxiosParamsDelete, editCallback } from "main/utils/UCSBDateUtils";
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

describe("energydrinkUtils tests", () => {
    // return a function that can be used as a mock implementation of getItem
    // the value passed in will be convertd to JSON and returned as the value
    // for the key "energydrinks".  Any other key results in an error
    const createGetItemMock = (returnValue) => (key) => {
        if (key === "energydrinks") {
            return JSON.stringify(returnValue);
        } else {
            throw new Error("Unexpected key: " + key);
        }
    };
    describe("onDeleteSuccess", () => {

        test("It puts the message on console.log and in a toast", () => {
            // arrange
            const restoreConsole = mockConsole();

            // act
            onDeleteSuccess("abc");

            // assert
            expect(mockToast).toHaveBeenCalledWith("abc");
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
                url: "/api/ucsbdates", //energydrinks
                method: "DELETE",
                params: { id: 17 }
            });
        });

    });

    describe("get", () => {

        test("When energydrinks is undefined in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(undefined));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = energydrinkUtils.get();

            // assert
            const expected = { nextId: 1, energydrinks: [] };
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("energydrinks", expectedJSON);
        });

        test("When energydrinks is null in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(null));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = energydrinkUtils.get();

            // assert
            const expected = { nextId: 1, energydrinks: [] };
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("energydrinks", expectedJSON);
        });

        test("When energydrinks is [] in local storage, should return []", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, energydrinks: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = energydrinkUtils.get();

            // assert
            const expected = { nextId: 1, energydrinks: [] };
            expect(result).toEqual(expected);

            expect(setItemSpy).not.toHaveBeenCalled();
        });

        test("When energydrinks is JSON of three energydrinks, should return that JSON", () => {

            // arrange
            const threeEnergyDrinks = energydrinkFixtures.threeEnergyDrinks;
            const mockEnergyDrinkCollection = { nextId: 10, energydrinks: threeEnergyDrinks };

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(mockEnergyDrinkCollection));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = energydrinkUtils.get();

            // assert
            expect(result).toEqual(mockEnergyDrinkCollection);
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });


    describe("getById", () => {
        test("Check that getting a energydrink by id works", () => {

            // arrange
            const threeEnergyDrinks = energydrinkFixtures.threeEnergyDrinks;
            const idToGet = threeEnergyDrinks[1].id;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, energydrinks: threeEnergyDrinks }));

            // act
            const result = energydrinkUtils.getById(idToGet);

            // assert

            const expected = { energydrink: threeEnergyDrinks[1] };
            expect(result).toEqual(expected);
        });

        test("Check that getting a non-existing energydrink returns an error", () => {

            // arrange
            const threeEnergyDrinks = energydrinkFixtures.threeEnergyDrinks;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, energydrinks: threeEnergyDrinks }));

            // act
            const result = energydrinkUtils.getById(99);

            // assert
            const expectedError = `energy drink with id 99 not found`
            expect(result).toEqual({ error: expectedError });
        });

        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeEnergyDrinks = energydrinkFixtures.threeEnergyDrinks;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, energydrinks: threeEnergyDrinks }));

            // act
            const result = energydrinkUtils.getById();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });

    });
    describe("add", () => {
        test("Starting from [], check that adding one energydrink works", () => {

            // arrange
            const energydrink = energydrinkFixtures.oneEnergyDrink[0];
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, energydrinks: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = energydrinkUtils.add(energydrink);

            // assert
            expect(result).toEqual(energydrink);
            expect(setItemSpy).toHaveBeenCalledWith("energydrinks",
                JSON.stringify({ nextId: 2, energydrinks: energydrinkFixtures.oneEnergyDrink }));
        });
    });

    describe("update", () => {
        test("Check that updating an existing energydrink works", () => {

            // arrange
            const threeEnergyDrinks = energydrinkFixtures.threeEnergyDrinks;
            const updatedEnergyDrink = {
                ...threeEnergyDrinks[0],
                name: "Updated Name"
            };
            const threeEnergyDrinksUpdated = [
                updatedEnergyDrink,
                threeEnergyDrinks[1],
                threeEnergyDrinks[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, energydrinks: threeEnergyDrinks }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = energydrinkUtils.update(updatedEnergyDrink);

            // assert
            const expected = { energydrinkCollection: { nextId: 5, energydrinks: threeEnergyDrinksUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("energydrinks", JSON.stringify(expected.energydrinkCollection));
        });
        test("Check that updating an non-existing energydrink returns an error", () => {

            // arrange
            const threeEnergyDrinks = energydrinkFixtures.threeEnergyDrinks;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, energydrinks: threeEnergyDrinks }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            const updatedEnergyDrink = {
                id: 99,
                name: "Fake Name",
                description: "Fake Description"
            }

            // act
            const result = energydrinkUtils.update(updatedEnergyDrink);

            // assert
            const expectedError = `energy drink with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });

    describe("del", () => {
        test("Check that deleting a energydrink by id works", () => {

            // arrange
            const threeEnergyDrinks = energydrinkFixtures.threeEnergyDrinks;
            const idToDelete = threeEnergyDrinks[1].id;
            const threeEnergyDrinksUpdated = [
                threeEnergyDrinks[0],
                threeEnergyDrinks[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, energydrinks: threeEnergyDrinks }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = energydrinkUtils.del(idToDelete);

            // assert

            const expected = { energydrinkCollection: { nextId: 5, energydrinks: threeEnergyDrinksUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("energydrinks", JSON.stringify(expected.energydrinkCollection));
        });
        test("Check that deleting a non-existing energydrink returns an error", () => {

            // arrange
            const threeEnergyDrinks = energydrinkFixtures.threeEnergyDrinks;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, energydrinks: threeEnergyDrinks }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = energydrinkUtils.del(99);

            // assert
            const expectedError = `energy drink with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeEnergyDrinks = energydrinkFixtures.threeEnergyDrinks;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, energydrinks: threeEnergyDrinks }));

            // act
            const result = energydrinkUtils.del();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });
    });

});
