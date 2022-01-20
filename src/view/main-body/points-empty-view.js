import { EmptyMessageStatement } from '../../const';
import Abstract from '../abstract';

const createPointsEmptyTemplate = (filterType) => {
  const message = EmptyMessageStatement[filterType];

  return `<p class="trip-events__msg">${message}</p>`;
};

export default class PointsEmptyView extends Abstract {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createPointsEmptyTemplate(this.#filterType);
  }
}
