import Abstract from './abstract';

export default class Smart extends Abstract {
  _data = {};

  updateData = (update) => {
    if (!update) {
      return;
    }

    this._data = {...this._data, ...update};
    this.updateElement();
  }

  updateElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;
    parent.replaceChilde(newElement, prevElement);

    this.restoreHandlers();
  }

  restoreHandlers = () => {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }
}
