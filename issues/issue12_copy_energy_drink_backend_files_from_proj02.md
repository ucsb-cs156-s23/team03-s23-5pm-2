Bring over backend crud files for EnergyDrink from team02

Throughout this issue, `EnergyDrink` is whatever the second model (in addition to `EnergyDrink` was in team02.  You may want to search and replace `EnergyDrink` with your class name and `EnergyDrink` with your class name (lowercase) before adding this issue to your project.

# Acceptance Criteria:

- [ ] The `@Entity` class called EnergyDrink.java has been copied from the team02 repo to the team03 repo and committed.
- [ ] The `@Repository` class called `EnergyDrinkRepository.java` has been copied from the team02 repo to the team03 repo and committed.  (Note that the file should be `EnergyDrinkRepository.java`; the team02 instrutions erronously called it `EnergyDrink.java`; if you called it `EnergyDrink.java` please update the name now)
- [ ] The `@Repository` class called `EnergyDrinkRepository.java` has been copied from the team02 repo to the team03 repo and committed.  (Note that the file should be `EnergyDrinkRepository.java`; the team02 instrutions erronously called it `EnergyDrink.java`; if you called it `EnergyDrink.java` please update the name now)
- [ ] The controller file `EnergyDrinkController.java` is copied from team02 to team03
- [ ] The controller tests file `EnergyDrinkControllerTests.java` is copied from team02 to team03

- [ ] You can see the `EnergyDrinks` table when you do these steps:
      1. Connect to postgres command line with 
         ```
         dokku postgres:connect team03-qa-db
         ```
      2. Enter `\dt` at the prompt. You should see
         `EnergyDrinks` listed in the table.
      3. Use `\q` to quit

- [ ] The backend POST,GET,PUT,DELETE endpoints for `Restauarant` all work properly in Swagger.

