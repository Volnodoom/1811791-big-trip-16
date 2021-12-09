import Abstract from '../abstract';

const createPointsEmptyTemplate = (message) => (
  `<p class="trip-events__msg">${message}</p>
  `);

export default class PointsEmptyView extends Abstract {
  #message = null;

  constructor(message) {
    super();
    this.#message = message;
  }

  get template() {
    return createPointsEmptyTemplate(this.#message);
  }
}
