import * as model from "./model.js";
import * as config from "./config";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime/runtime";
import View from "./views/View.js";
const recipeContainer = document.querySelector(".recipe");
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
if (module.hot) {
  module.hot.accept();
}
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    //render spinner
    recipeView.renderSpinner();
    // update results view to mark selected search result
    resultsView.update(model.GetSearchResultsPage());
    // loading recipe
    await model.loadRecipe(id);
    //rendering recipe
    recipeView.render(model.state.recipe);
    //updatting bookmarks

    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    // get search query

    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();
    // load search results

    await model.loadSearchResults(query);
    // render results

    resultsView.render(model.GetSearchResultsPage());
    // render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (goToPage) {
  // render results

  resultsView.render(model.GetSearchResultsPage(goToPage));
  // render initial pagination buttons
  paginationView.render(model.state.search);
};
const controlServings = function (newSErvings) {
  // undate the recip serving in state
  model.updateSErvings(newSErvings);
  // update the rcipe view
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  // add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);
  //upadate recipe view
  recipeView.update(model.state.recipe);
  //3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlbookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    //render recipe
    recipeView.render(model.state.recipe);
    // success message
    addRecipeView.renderMessage();
    // render bookmark view
    bookmarksView.render(model.state.bookmarks);
    //change id in url
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, config.MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlbookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
