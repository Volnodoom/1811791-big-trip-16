import { createElement } from '../../render';

const createPointsEmptyTemplate = (message) => (
  `<p class="trip-events__msg">${message}</p>
  `);

export default class PointsEmptyView {
  #element = null;
  #message = null;

  constructor(message) {
    this.#message = message;
  }

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createPointsEmptyTemplate(this.#message);
  }

  removeElement() {
    this.#element = null;
  }
}
