import Abstract from '../abstract';


const createNoTaskTemplate = () => (
  `<p class="trip-events__msg">
    Loading...
  </p>`
);

export default class LoadingView extends Abstract {
  get template() {
    return createNoTaskTemplate();
  }
}
