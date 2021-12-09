import { createElement } from '../render';

export default class Abstract {
  #element = null;
  _callback = {};

  constructor() {
    if (new.target === Abstract) {
      throw new Error('Can\'t instantiate AbstractView, only concrete one.');
    }
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    throw new Error('Abstract method is not implemented: get template');
  }

  removeElement() {
    this.#element = null;
  }
}
