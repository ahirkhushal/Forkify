import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

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
    resultsView.render(model.getSearchResultspage(1));

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

const init = function () {
  recipeView.addhandlerRender(controlRecipes);
  searchView.addHandlerSearch(controloSearchResult);
  paginationView.addHandlerClick(ControlPagination);
};

init();
