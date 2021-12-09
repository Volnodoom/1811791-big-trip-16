import { SortingLabelStartFrame } from '../../const';
import Abstract from '../abstract';

const createSortTemplate = () => {
  const getSortingLabel = (sortingInfo) => {
    const {
      lowCaseWord,
      capitalLetterWord,
      isChecked,
      isDisabled,
    } = sortingInfo;

    return `<div class="trip-sort__item  trip-sort__item--${lowCaseWord}">

      <input
        id="sort-${lowCaseWord}"
        class="trip-sort__input  visually-hidden"
        type="radio" name="trip-sort"
        value="sort-${lowCaseWord}"
        ${isChecked ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}
      />

      <label class="trip-sort__btn" for="sort-${lowCaseWord}"
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
  get template() {
    return createSortTemplate();
  }


}
