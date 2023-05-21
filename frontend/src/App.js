import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";

import TodosIndexPage from "main/pages/Todos/TodosIndexPage";
import TodosCreatePage from "main/pages/Todos/TodosCreatePage";
import TodosEditPage from "main/pages/Todos/TodosEditPage";

import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";
import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";

import BookCreatePage from "main/pages/Books/BookCreatePage";

import EnergyDrinkIndexPage from "main/pages/Energy Drinks/EnergyDrinkIndexPage";
import EnergyDrinkCreatePage from "main/pages/Energy Drinks/EnergyDrinkCreatePage";
import EnergyDrinkEditPage from "main/pages/Energy Drinks/EnergyDrinkEditPage";
import EnergyDrinkDetailsPage from "main/pages/Energy Drinks/EnergyDrinkDetailsPage";

import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";
import BookEditPage from "main/pages/Books/BookEditPage";
import BookIndexPage from "main/pages/Books/BookIndexPage";
import BookDetailPage from "main/pages/Books/BookDetailPage";

import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";
import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
import RestaurantDetailPage from "main/pages/Restaurants/RestaurantDetailPage";


function App() {

  const { data: currentUser } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/profile" element={<ProfilePage />} />
        {
          hasRole(currentUser, "ROLE_ADMIN") && <Route exact path="/admin/users" element={<AdminUsersPage />} />
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/todos/list" element={<TodosIndexPage />} />
              <Route exact path="/todos/create" element={<TodosCreatePage />} />
              <Route exact path="/todos/edit/:todoId" element={<TodosEditPage />} />
            </>
          )
        }

        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/ucsbdates/list" element={<UCSBDatesIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/ucsbdates/edit/:id" element={<UCSBDatesEditPage />} />
              <Route exact path="/ucsbdates/create" element={<UCSBDatesCreatePage />} />
            </>
          )
        }
         {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/energydrinks/list" element={<EnergyDrinkIndexPage />} />
              <Route exact path="/energydrinks/detail/:id" element={<EnergyDrinkDetailsPage />} />
            </>
          )
        }
         {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/energydrinks/edit/:id" element={<EnergyDrinkEditPage />} />
              <Route exact path="/energydrinks/create" element={<EnergyDrinkCreatePage />} />
            </>
          )
        }
        

        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/books/create" element={<BookCreatePage />} />
              <Route exact path="books/edit/:id" element={<BookEditPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/books/list" element={<BookIndexPage />} />
              <Route exact path="/books/detail/:id" element={<BookDetailPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/restaurants/create" element={<RestaurantCreatePage />} />
              <Route exact path="restaurants/edit/:id" element={<RestaurantEditPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/restaurants/list" element={<RestaurantIndexPage />} />
              <Route exact path="/restaurants/detail/:id" element={<RestaurantDetailPage />} />
            </>
          )
        }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
