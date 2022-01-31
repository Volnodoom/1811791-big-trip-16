import { SortingLabelStartFrame } from '../../const';
import Abstract from '../abstract';

const createSortTemplate = (currentSortType) => {
  const getSortingLabel = (sortingInfo) => {
    const {
      lowCaseWord,
      capitalLetterWord,
      isDisabled,
    } = sortingInfo;

    return `<div class="trip-sort__item  trip-sort__item--${lowCaseWord}">

      <input
        id="sort-${lowCaseWord}"
        class="trip-sort__input  visually-hidden"
        type="radio" name="trip-sort"
        value="sort-${lowCaseWord}"
        ${(currentSortType === SortingLabelStartFrame.DAY.lowCaseWord) && (currentSortType === lowCaseWord) ? 'checked' : ''}
        ${(currentSortType === SortingLabelStartFrame.TIME.lowCaseWord) && (currentSortType === lowCaseWord) ? 'checked' : ''}
        ${(currentSortType === SortingLabelStartFrame.PRICE.lowCaseWord) && (currentSortType === lowCaseWord) ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}
      />

      <label
      class="trip-sort__btn"
      for="sort-${lowCaseWord}"
      data-sort-type="${lowCaseWord}"
      >
      ${capitalLetterWord}
      </label>

    </div>`;
  };

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">

  ${Object
    .values(SortingLabelStartFrame)
    .map((startFrame) => getSortingLabel(startFrame))
    .join(' ')}

  </form>`;
};

export default class SortingListView extends Abstract{
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#handleSortTypeChange);
  }

  #handleSortTypeChange = (evt) => {
    switch (evt.target.dataset.sortType) {
      case SortingLabelStartFrame.DAY.lowCaseWord:
        this._callback.sortTypeChange(evt.target.dataset.sortType);
        break;
      case SortingLabelStartFrame.TIME.lowCaseWord:
        this._callback.sortTypeChange(evt.target.dataset.sortType);
        break;
      case SortingLabelStartFrame.PRICE.lowCaseWord:
        this._callback.sortTypeChange(evt.target.dataset.sortType);
        break;
    }
  }
}
