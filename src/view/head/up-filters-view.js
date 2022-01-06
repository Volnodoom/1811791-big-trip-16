import { FilterLabelStartFrame } from '../../const';
import Abstract from '../abstract';

const createFiltersTemplate = (currentFilterType) => {
  const getSingleFilterDescription = (filterInfo) => {
    const {lowCaseWord, capitalLetterWord} = filterInfo;

    return `<div class="trip-filters__filter">

    <input
    id="filter-${lowCaseWord}"
    class="trip-filters__filter-input  visually-hidden"
    type="radio"
    name="trip-filter"
    value="${lowCaseWord}"
    ${currentFilterType === lowCaseWord ? 'checked' : ''}
    />

    <label
    class="trip-filters__filter-label"
    for="filter-everything"
    >${capitalLetterWord}</label>

    </div>`;
  };

  return `<form class="trip-filters" action="#" method="get">
    ${Object
    .values(FilterLabelStartFrame)
    .map((StartFrame) => getSingleFilterDescription(StartFrame))
    .join(' ')}


    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class UpFiltersView extends Abstract{
  #currentFilter = null;

  constructor(currentFilter) {
    super();
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createFiltersTemplate(this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    this._callback.filterTypeChange(evt.target.value);
  }
}
