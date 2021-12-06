import { createElement } from '../../render';

const createPointsListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class PointListView {
  #element = null;

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createPointsListTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
