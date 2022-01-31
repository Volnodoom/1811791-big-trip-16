import { MenuItem, NOTHING } from '../../const';
import Abstract from '../abstract';

const createMenuTemplate = (isTableActive, isStatistickActive, numberOfPoints) => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  ${isTableActive ? 'trip-tabs__btn--active' : ''}" href="#"}>${MenuItem.TABLE}</a>
    ${numberOfPoints > NOTHING ? `<a class="trip-tabs__btn  ${isStatistickActive ? 'trip-tabs__btn--active' : ''}" href="#">${MenuItem.STATS}</a>` : ''}
  </nav>`
);

export default class UpMenuView extends Abstract {
  #isTableActive = null;
  #isStatistickActive = null;
  #numberOfPoints = null;

  constructor (isTableActive, isStatistickActive, numberOfPoints) {
    super();

    this.#isTableActive = isTableActive;
    this.#isStatistickActive = isStatistickActive;
    this.#numberOfPoints = numberOfPoints;
  }

  get template() {
    return createMenuTemplate(this.#isTableActive, this.#isStatistickActive, this.#numberOfPoints);
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#handleMenuClick);
  }

  #handleMenuClick = (evt) => {
    evt.preventDefault();
    this._callback.menuClick(evt.target.textContent);
  }
}
