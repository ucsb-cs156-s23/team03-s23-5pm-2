Bring over backend crud files for Restaurant from team02

# Acceptance Criteria:

- [ ] The `@Entity` class called Restaurant.java has been copied from the team02 repo to the team03 repo and committed.
- [ ] The `@Repository` class called `RestaurantRepository.java` has been copied from the team02 repo to the team03 repo and committed.  (Note that the file should be `RestaurantRepository.java`; the team02 instrutions erronously called it `Restaurant.java`; if you called it `Restaurant.java` please update the name now)
- [ ] The `@Repository` class called `RestaurantRepository.java` has been copied from the team02 repo to the team03 repo and committed.  (Note that the file should be `RestaurantRepository.java`; the team02 instrutions erronously called it `Restaurant.java`; if you called it `Restaurant.java` please update the name now)
- [ ] The controller file `RestaurantController.java` is copied from team02 to team03
- [ ] The controller tests file `RestaurantControllerTests.java` is copied from team02 to team03

- [ ] You can see the `restaurants` table when you do these steps:
      1. Connect to postgres command line with 
         ```
         dokku postgres:connect team03-qa-db
         ```
      2. Enter `\dt` at the prompt. You should see
         `restaurants` listed in the table.
      3. Use `\q` to quit

- [ ] The backend POST,GET,PUT,DELETE endpoints for `Restauarant` all work properly in Swagger.