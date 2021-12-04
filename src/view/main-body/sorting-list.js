import { SortingLabeling } from '../../const';
import { createElement } from '../../render';

const createSortTemplate = () => {
  const getSortingLabel = (sortingInfo, isChecked = false, isDisabled = false) => (
    `<div class="trip-sort__item  trip-sort__item--${sortingInfo.lowCaseWord}">

      <input
        id="sort-${sortingInfo.lowCaseWord}"
        class="trip-sort__input  visually-hidden"
        type="radio" name="trip-sort"
        value="sort-${sortingInfo.lowCaseWord}"
        ${isChecked ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}
      />

      <label class="trip-sort__btn" for="sort-${sortingInfo.lowCaseWord}"
      >
      ${sortingInfo.capitalLetterWord}
      </label>

    </div>`
  );

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${getSortingLabel(SortingLabeling.DAY, true)}
    ${getSortingLabel(SortingLabeling.EVENT, false, true)}
    ${getSortingLabel(SortingLabeling.TIME)}
    ${getSortingLabel(SortingLabeling.PRICE)}
    ${getSortingLabel(SortingLabeling.OFFERS, false, true)}
  </form>`;
};

export default class SortingList {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createSortTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
