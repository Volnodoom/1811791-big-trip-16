import { RenderPosition } from '../const';
import { render } from '../render';
import UpFiltersView from '../view/head/up-filters-view';
import UpMenuView from '../view/head/up-menu-view';
import UpTripInfoView from '../view/head/up-trip-info-view';

export default class HeadSitePresenter {
  #headContainer = null;
  #navigationContainer = null;

  #tripInfoContainer = null;
  #menuContainer = new UpMenuView();
  #filtersContainer =  new UpFiltersView();

  #tripPoints = [];

  constructor(containerHead, containerNavigation) {
    this.#headContainer = containerHead;
    this.#navigationContainer = containerNavigation;
  }

  init = (travelPoints) => {
    this.#tripPoints = [...travelPoints];

    this.#tripInfoContainer = new UpTripInfoView(travelPoints);

    this.#renderHead();
  }

  #renderHead = () => {
    if (this.#tripPoints.length > 0) {
      render(this.#headContainer, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
    }

    render(this.#navigationContainer, this.#menuContainer, RenderPosition.BEFOREEND);
    render(this.#navigationContainer, this.#filtersContainer, RenderPosition.BEFOREEND);
  }

}
