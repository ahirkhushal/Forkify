import view from './view';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class bookMarksView extends view {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. find a nice recipe and bookmark it ;)';
  _message = '';

  _generateMarkup() {
    return this._data
      .map(bookmarks => {
        return previewView.render(bookmarks, false);
      })
      .join('');
  }
}

export default new bookMarksView();
