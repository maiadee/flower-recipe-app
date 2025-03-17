# FloralFolio

![FloralFolio](<ReadMe Images/floralfolio-logo.png>)

### Description 

For Project 2, I created a Floral Folio App, an app I would personally want and use. The app allows users to sign up and access their own bank of empty recipes, they can store flowers from our flower library in these recipes and add personalised notes. This feature lets users experiment with different colour and texture combinations before committing to purchases on a webshop, where your basket is timed. Additionally, users can contribute by adding new flowers to the library, updating existing entries, and adding notes to flower profiles for the benefit of other users.

### Deployment link

https://floralfolio.netlify.app/

Please register an account and login to explore the app

### Timeframe

We were been given 1 week to work on this project individually

### Technologies used

Node.js, Express, MongoDB, Mongo Atlas, Mongoose, Postman, Netlify, Javascript, Trello

### Brief

We were asked to create a MEN Stack CRUD app using Node.js, Express and MongoDB. Our app must use EJS templates to render views to users and session-based authentication with full CRUD functionality.

- The app utilizes EJS Templates for rendering views to users.
- The app uses session-based authentication.
- The app’s files are organized following the conventions taught in lectures.
- The app has at least one data entity in addition to the User model. At least one entity must have a relationship with the User model.
- The app has full CRUD functionality.
- Authorization is implemented in the app. Guest users (those not signed in) should not be able to create, update, or delete data in the application or access functionality allowing those actions.
- The app is deployed online so that the rest of the world can use it.

### Planning

![FloralFolio](<ReadMe Images/floralfolio-wireframe.png>)

![FloralFolio](<ReadMe Images/floralfolio-trello.png>)

### Build/Code Process

Day 1
- Created wireframes and organized the project on Trello, mapping out the relationships between the code and pages.
- Set up the project structure, installed necessary packages, and seeded the initial data (user, recipe, images).
- Started developing controllers and basic .ejs files for the app's views.

Day 2
- I got all my controllers working but ran into issues with mismatched links and ensuring the right pages (POST vs. GET) were accessed.
- I decided to add support for multiple recipes, creating a recipe page with links to each one, similar to the index and show pages. I added dropdown selectors to assign flowers to the correct recipe and created an "add to recipe" button. I used the slice() method to format recipe names and struggled with targeting the right flower array within the recipe.

``` javascript 
router
  .route("/flower-library/:id/add-flower")
  .post(async function (req, res, next) {
    try {
      const user = req.session.user;
      const flowerId = req.params.id;
      const selectedRecipe = req.body.recipe;

      const slicedRecipe =
        selectedRecipe.slice(0, 6) + " " + selectedRecipe.slice(6);

      const recipes = await Recipe.find({ user: user._id });

      const recipe = recipes.find((recipe) => {
        if (recipe.name === slicedRecipe) {
          return recipe;
        }
      });

      const flowerFromDb = await Flower.findById(flowerId);

      recipe.flower.push(flowerFromDb);
      await recipe.save();

      res.redirect(`/recipe-library/${recipe._id}`);
    } catch (e) {
      next(e);
    }
  });
```
- Here, I am extracting data from the logged-in user session, the flower ID, and retrieving the selected recipe from the form data. I use the slice() method to format the recipe name and then query the database for the user's recipes to find the one that matches the formatted name. Finally, I add the selected flower to that recipe's flower array, save and redirect.

![FloralFolio](<ReadMe Images/floralfolio-select.png>)
  
- I also had difficulty with the "delete from recipe" button, especially finding the flower ID within the recipe and handling duplicates.
- After overcoming these challenges, I now have a better understanding of managing these features. Finally, I added basic styling with a neutral color palette for testing color combinations.

Day 3
- I spent the first half of the day adding a filter to allow users to filter flowers by color and season using checkboxes. I ensured the endpoint handled both multiple and single selections. I ran into issues with duplicate routes, so I replaced the original flower-library GET endpoint with the filtered one.

``` javascript
router.route("/flower-library").get(async function (req, res, next) {
  try {
    const { color, season } = req.query;

    let query = {};

    if (color && Array.isArray(color)) {
      query.color = {
        $in: color.map((c) => new RegExp(`^${c}$`, "i")), 
      };
    } else if (color) {
      query.color = new RegExp(`^${color}$`, "i");
    }

    if (season && Array.isArray(season)) {
      query.season = { $in: season };
    } else if (season) {
      query.season = season;
    }

    const flowers = await Flower.find(query);

    res.render("flowers/index.ejs", { allFlowers: flowers });
  } catch (e) {
    next(e);
  }
});
```
- In the code above I am extracting the query parameters, constructing a MongoDB query based on those parameters, executing the query to retrieve matching results, and then rendering the results on the page.

![FloralFolio](<ReadMe Images/floralfolio-filter.png>)

- I also spent time styling the library page, switching from ul to div elements after some trial and error. Finally, I styled all pages to keep the design clear and simple without interfering with the app's purpose.

Day 4
- I added a notes section to my recipe pages but realised I needed a new recipe notes schema in the recipe model for clarity. This took some time due to syntax errors and reseeding the data.
  
``` javascript
const recipeNoteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "You can't post an empty note!"],
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const recipeSchema = new mongoose.Schema({
  name: { type: String },
  flower: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Flower", required: true },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  notes: [recipeNoteSchema],
});
```
![FloralFolio](<ReadMe Images/floralfolio-recipenotes.png>)

- I modified my recipeSchema to include an array of notes using the recipeNoteSchema. This allows each recipe to have multiple notes associated with it, ensuring better organisation and structure.
  
- I finalized styling and fixed error messages to polish the app. I also tested different functionalities to identify potential issues and added error pages with redirects for better readability.
- To improve UX/UI, I made the images on the library and recipe pages clickable.

Day 5
- I realised recipes weren’t correctly tied to the logged-in user, a pretty vital aspect of my app! I updated the POST endpoint to link flowers to the current user, their recipes, and the specific recipe. In the code above from day 2 the following two lines of code were added to ensure that the recipes were linked to the currently logged-in user by querying for recipes where the user field matches the user's ID stored in the session -
  
``` javascript
const user = req.session.user;
const recipes = await Recipe.find({ user: user._id });
```
  
- I also updated the recipe schema to allow for multiple instances of "Recipe 1" and ensured that 4 recipes were created for each user on sign-up.
- After deploying the app, I found build issues caused by multiple Mongoose imports, which I fixed to get the app running.

![FloralFolio](<ReadMe Images/floralfolio-show.png>)

### Challenges

- Managing complex relationships between models. I had to ensure the correct data was linked, like adding flowers to the right recipe and tying recipes to the logged-in user. This required a lot of debugging to fix issues.

- The domino effect of changes. Small changes, especially when updating models like the recipe schema, often caused unexpected issues that I had to resolve step by step.

- Fixing bugs with duplicate code. Some problems weren’t obvious from error messages, so I had to backtrack through my code, checking each section to pinpoint where things were going wrong.

- New features and learning on the go. The project required new features beyond what we had learned, such as handling multiple recipes per user, managing multiple users, adding dropdown selectors, and filtering flowers. It involved a lot of adapting, diving into documentation, and continuous testing/debugging.

### Wins

- One feature I’m particularly proud of is the dynamic filter that allows users to search for flowers by color and season. It was a challenging task as I had to handle multiple criteria and ensure the endpoint was replaced cleanly. I began by filtering by a single color, then expanded it to support multiple colors and seasons, and ultimately made the filter case-insensitive.

- I set a solid foundation for the project by creating wireframes, Trello boards, necessary files, models, and data seeds right from the start. This structure gave me a clear direction, making the rest of the project much easier to manage.

- I enhanced my app’s functionality and UX by incorporating stretch goals, such as supporting multiple recipes, adding dropdown selectors, and making images clickable for improved user interaction.

### Key Learnings/Takeaways

- I feel much more confident with EJS and Express after completing this project. I now have a clearer understanding of how models and controllers interact, and I’ve learned just how crucial it is to get them right from the start. Debugging the relationships between users, recipes, and flowers was challenging, but it significantly improved my ability to structure schemas and manage nested data effectively.

- My project management skills have improved considerably since my last project. This time, I had a much better idea of how long each feature would take to implement, which helped me stay on track. As a result, I was able to add a few stretch goals and really polish the app. Having that extra time to refine both the functionality and user experience made a huge difference. It’s shown me how valuable proper planning is for staying organised and leaving room for improvements.

### Bugs

- Some images don’t work

### Future Improvements

- Add a search bar to my flower library
- Combine flower profiles of the same flower with multiple colour choices. The image showing would depend on the colour selected by the user
- Add larger text options to make app more accessible 
- Add a cost estimator feature to recipes
- Drag and drop feature to move flower order within recipes
- Give the user the ability to share their recipes (Possibly via email)
- Flower recommendations on recipes pages (Use a random generator? Or by assessing current colours/seasons of flower choices?)



