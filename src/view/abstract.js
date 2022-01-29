import { SHAKE_ANIMATION_TIMEOUT, SHAKE_DURATION } from '../const';
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

  shake(callback) {
    this.element.style.animation = `shake ${SHAKE_DURATION}s`;
    setTimeout(() => {
      this.element.style.animation = '';
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
