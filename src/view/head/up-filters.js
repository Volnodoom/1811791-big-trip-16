import { FilterLabeling } from '../../const';
import { createElement } from '../../render';

const createFiltersTemplate = () => {
  const getSingleFilterDescription = (filterInfo, isChecked = false) => (
    `<div class="trip-filters__filter">

    <input
    id="filter-${filterInfo.lowCaseWord}"
    class="trip-filters__filter-input  visually-hidden"
    type="radio"
    name="trip-filter"
    value="${filterInfo.lowCaseWord}"
    ${isChecked ? 'checked' : ''}
    />

    <label
    class="trip-filters__filter-label"
    for="filter-everything"
    >${filterInfo.capitalLetterWord}</label>

    </div>`
  );

  return `<form class="trip-filters" action="#" method="get">
    ${getSingleFilterDescription(FilterLabeling.EVERYTHING, true)}
    ${getSingleFilterDescription(FilterLabeling.FUTURE)}
    ${getSingleFilterDescription(FilterLabeling.PAST)}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class UpFiltersView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFiltersTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
