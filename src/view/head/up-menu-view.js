import { MenuItem } from '../../const';
import Abstract from '../abstract';

const createMenuTemplate = (isTableActive, isStatistickActive) => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  ${isTableActive ? 'trip-tabs__btn--active' : ''}" href="#"}>${MenuItem.TABLE}</a>
    <a class="trip-tabs__btn  ${isStatistickActive ? 'trip-tabs__btn--active' : ''}" href="#">${MenuItem.STATS}</a>
  </nav>`
);

export default class UpMenuView extends Abstract {
  #isTableActive = true;
  #isStatistickActive = false;

  get template() {
    return createMenuTemplate(this.#isTableActive, this.#isStatistickActive);
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#menuClickHandler);
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.menuClick(evt.target.textContent);
  }

  setMenuItem = (menuItem) => {
    if (menuItem === MenuItem.STATS) {
      this.#isTableActive = false;
      this.#isStatistickActive = true;
    } else {
      this.#isTableActive = true;
      this.#isStatistickActive = false;
    }
  }


}
