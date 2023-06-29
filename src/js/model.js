import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },

  bookamarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);

    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    if (state.bookamarks.some(bookamark => bookamark.id === id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultspage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookMarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookamarks));
};

export const addBookmark = function (recipe) {
  //add bookmark
  state.bookamarks.push(recipe);

  //mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookMarks();
};

export const deleteBookMark = function (id) {
  const index = state.bookamarks.findIndex(el => el.id === id);
  state.bookamarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookMarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');

  if (storage) state.bookamarks = JSON.parse(storage);
};
init();
console.log(state.bookamarks);
