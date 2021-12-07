import Abstract from '../abstract';

const createPointsListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class PointListView extends Abstract {
  get template() {
    return createPointsListTemplate();
  }
}
