import { FilterLabelStartFrame } from '../const';
import AbstractObservable from './abstract-observer';

export default class FilterModel extends AbstractObservable {
  #filter = FilterLabelStartFrame.EVERYTHING.filter;

  get filter() {
    return this.#filter;
  }

  setFilter = (updateType, filter) => {
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}
