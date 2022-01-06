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
  #filtersComponent =  null;

  #tripPoints = [];

  #filterModel = null;

  constructor(containerHead, containerNavigation, filterModel) {
    this.#headContainer = containerHead;
    this.#navigationContainer = containerNavigation;
    this.#filterModel = filterModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init = (travelPoints) => {
    this.#filtersComponent =  new UpFiltersView(this.#filterModel.filter);
    this.#filtersComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    this.#tripPoints = [...travelPoints];

    this.#tripInfoContainer = new UpTripInfoView(travelPoints);

    this.#renderHead();


  }

  #renderFilter = () => {

  }

  #handleFilterTypeChange = () => {

  }

  #handleModelEvent = () => {
    this.init();
  }

  #renderHead = () => {
    if (this.#tripPoints.length > 0) {
      render(this.#headContainer, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
    }

    render(this.#navigationContainer, this.#menuContainer, RenderPosition.BEFOREEND);
    render(this.#navigationContainer, this.#filtersComponent, RenderPosition.BEFOREEND);
  }

}
