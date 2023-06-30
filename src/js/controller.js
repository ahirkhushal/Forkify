import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookMarksView from './views/bookMarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }
//loading recipe
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    //guard clouse --> when id is empty then returns nothing
    if (!id) return;

    //render spinner
    recipeView.renderspinner();

    //results view to mark selected search result
    resultsView.update(model.getSearchResultspage());

    //updating bookmarks view
    bookMarksView.update(model.state.bookamarks);

    //LOADING THE RECIPE
    await model.loadRecipe(id);

    //rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    alert(err.message);
  }
};

//loading results
const controloSearchResult = async function () {
  try {
    //render spinner
    resultsView.renderspinner();

    // get search query
    const query = searchView.getQuery();
    if (!query) return;

    //load search results
    await model.loadSearchResult(query);

    //render results
    resultsView.render(model.getSearchResultspage());

    //render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

//this function run on click happen on pagination button
const ControlPagination = function (goToPage) {
  //render  new results
  resultsView.render(model.getSearchResultspage(goToPage));

  //render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings (in the state)
  model.updateServings(newServings);

  //update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookMark = function () {
  //add or remove bookmark
  console.log(model.state);
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookMark(model.state.recipe.id);

  //update recipe view
  recipeView.update(model.state.recipe);

  //render bookmark view

  bookMarksView.render(model.state.bookamarks);
};

const controlBookMarks = function () {
  bookMarksView.render(model.state.bookamarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderspinner();

    //upload the new recipe data
    await model.uploadRecipe(newRecipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderSuccessMsg();

    //render bookmarkview
    bookMarksView.render(model.state.bookamarks);

    //change id in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window
    setTimeout(function () {
      console.log('ok');
      addRecipeView.toggleWIndow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookMarksView.addHandlerRender(controlBookMarks);
  recipeView.addhandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addhandlerAddBookMark(controlAddBookMark);
  searchView.addHandlerSearch(controloSearchResult);
  paginationView.addHandlerClick(ControlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
