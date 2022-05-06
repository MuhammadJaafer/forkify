import View from "./View.js";
import previewView from "./previewView.js";
import icons from "url:../../img/icons.svg";

class Resultsview extends View {
  _parentElement = document.querySelector(".results");
  _errMessage = "No recipes found for your query! please try again :)";
  _message = "";
  _generateMarkup() {
    return this._data
      .map((bookmark) => previewView.render(bookmark, false))
      .join("");
  }
}
export default new Resultsview();
