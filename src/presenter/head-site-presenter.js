import { FilterLabelStartFrame, MenuItem, RenderPosition, UpdateType } from '../const';
import { remove, render, replace } from '../render';
import { sortDate } from '../utils';
import UpFiltersView from '../view/head/up-filters-view';
import UpMenuView from '../view/head/up-menu-view';
import UpTripInfoView from '../view/head/up-trip-info-view';

export default class HeadSitePresenter {
  #headContainer = null;
  #navigationContainer = null;
  #tripInfoContainer = null;

  #menuComponent = new UpMenuView();
  #filtersComponent =  null;

  #filterModel = null;
  #pointsModel = null;

  #destroyBoard = null;
  #initBoard = null;
  #hideTripEvents = null;
  #revielTripEvents = null;

  constructor(containerHead, containerNavigation, pointsModel, filterModel) {
    this.#headContainer = containerHead;
    this.#navigationContainer = containerNavigation;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;


    this.#pointsModel.addObserver(this.#handlePointsModelEvent);
  }

  init = () => {
    if (this.allPoints.length > 0) {
      this.renderHeadInfo();
    }

    render(this.#navigationContainer, this.#menuComponent, RenderPosition.BEFOREEND);
    this.#menuComponent.setMenuClickHandler(this.handleSiteMenuClick);
    this.renderFilter();
  }

  get allPoints () {
    this.#pointsModel.points.sort(sortDate);
    return this.#pointsModel.points;
  }

  renderHeadInfo = () => {
    const prevHeadInfoComponent = this.#tripInfoContainer;

    this.#tripInfoContainer = new UpTripInfoView(this.allPoints);

    if (prevHeadInfoComponent === null) {
      render(this.#headContainer, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoContainer, prevHeadInfoComponent);
    remove(prevHeadInfoComponent);
  }

  renderFilter = () => {
    const prevFilterComponent = this.#filtersComponent;

    this.#filtersComponent =  new UpFiltersView(this.#filterModel.filter);
    this.#filtersComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    this.#filterModel.addObserver(this.#handleFilterModelEvent);

    if (prevFilterComponent === null) {
      render(this.#navigationContainer, this.#filtersComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#filtersComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  handleSiteMenuClick = (menuItem) => {
    switch (menuItem) {
      case MenuItem.ADD_NEW_POINT:

        break;
      case MenuItem.TABLE:

        this.#revielTripEvents();
        this.#initBoard();
        this.renderFilter();

        break;
      case MenuItem.STATS:
        this.#destroyBoard();
        this.#destroyFilter();
        this.#hideTripEvents();
        break;
    }
  }

  getBoardFunctionality = (destroyBoard, initBoard, hideTripEvents, revielTripEvents) => {
    this.#destroyBoard = destroyBoard;
    this.#initBoard = initBoard;
    this.#hideTripEvents = hideTripEvents;
    this.#revielTripEvents = revielTripEvents;
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  #handleFilterModelEvent = () => {
    this.renderFilter();
  }

  #handlePointsModelEvent = () => {
    this.renderHeadInfo();
  }

  #destroyFilter = () => {
    remove(this.#filtersComponent);
    this.#filtersComponent = null;

    this.#filterModel.removeObserver(this.#handleFilterModelEvent);

    this.#filterModel.setFilter(UpdateType.MAJOR, FilterLabelStartFrame.EVERYTHING.filter);
  }
}
