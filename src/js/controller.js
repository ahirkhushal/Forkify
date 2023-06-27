import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

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
    console.error(err.message);
  }
};

const init = function () {
  recipeView.addhandlerRender(controlRecipes);
};

init();

// const resultsContainer = document.querySelector('.results');
// const foodId = ` <li class="preview">
// <a class="preview__link preview__link--active" href="${id}">
//   <figure class="preview__fig">
//     <img src="${recipe.image}" alt="Test" />
//   </figure>
//   <div class="preview__data">
//     <h4 class="preview__title">${recipe.title}</h4>
//     <p class="preview__publisher">${recipe.publisher}</p>
//     <div class="preview__user-generated">
//       <svg>
//         <use href="${icons}#icon-user"></use>
//       </svg>
//     </div>
//   </div>
// </a>
// </li>
// `;

//     resultsContainer.insertAdjacentHTML('afterbegin', foodId);
