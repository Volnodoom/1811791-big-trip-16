import { FilterLabelStartFrame, RenderPosition, SortingLabelStartFrame, UpdateType, UserAction } from '../const';
import { remove, render, replace } from '../render';
import PointsEmptyView from '../view/main-body/points-empty-view';
import SortingListView from '../view/main-body/sorting-list-view';
import PointsListView from '../view/main-body/points-list-view';
import PointPresenter from './point-presenter';
import { filterPointsForTimeDifference, sortDate, sortDuration, sortPrice } from '../utils';
import NewEventBtnView from '../view/head/new-event-btn-view';
import AddNewPointPresenter from './add-new-point-presenter';

export default class TripBoardPresenter {
  #pointsModel = null;
  #filterModel = null;

  #tripBoardContainer = null;
  #pointsEmptyComponent = null;
  #tripPointsListComponent = new PointsListView();
  #sortingComponent = null;
  #newEventBtnComponent = null;
  #addNewPointPresenter = null;
  #containerForNewEventBtn = null;

  #currentSortType = SortingLabelStartFrame.DAY.lowCaseWord;
  #filterType = FilterLabelStartFrame.EVERYTHING.filter;
  #pointPresentersStore = new Map();

  #addNewBtnStatus = {isAddNewBtn: false, state: false};

  constructor(tripBoardContainer, pointsModel, filterModel) {
    this.#tripBoardContainer = tripBoardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get allPoints() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filterPointsForTimeDifference[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortingLabelStartFrame.DAY.lowCaseWord:
        filteredPoints.sort(sortDate);
        break;
      case SortingLabelStartFrame.TIME.lowCaseWord:
        filteredPoints.sort(sortDuration);
        break;
      case SortingLabelStartFrame.PRICE.lowCaseWord:
        filteredPoints.sort(sortPrice);
        break;
      default:
        return this.#pointsModel.points;
    }

    return filteredPoints;
  }

  init = () => {

    const prevNewEventBtnComponent = this.#newEventBtnComponent;
    this.#newEventBtnComponent = new NewEventBtnView();
    this.#containerForNewEventBtn = this.#newEventBtnComponent.getContainerForBtn();

    if (prevNewEventBtnComponent === null) {
      render(this.#containerForNewEventBtn, this.#newEventBtnComponent, RenderPosition.BEFOREEND);

      this.#renderTripBoard();
      this.#setAddNewPoint();
      return;
    }

    replace(this.#newEventBtnComponent, prevNewEventBtnComponent);
    remove(prevNewEventBtnComponent);
  }

  #renderSort = () => {
    this.#sortingComponent = new SortingListView(this.#currentSortType);
    this.#sortingComponent.setSortTypeChangeHandler(this.#handleSortChange);

    render(this.#tripBoardContainer, this.#sortingComponent, RenderPosition.BEFOREEND);
  }

  #renderNoPoints = () => {
    this.#pointsEmptyComponent = new PointsEmptyView(this.#filterType);
    return render(this.#tripBoardContainer, this.#pointsEmptyComponent, RenderPosition.BEFOREEND);
  }

  #renderOneTripPoint = (oneTravelPoint) => {
    const pointPresenter = new PointPresenter(
      this.#tripPointsListComponent,
      this.#handleViewAction,
      this.#handleChangeMode,
      this.allPoints,
    );
    this.#pointPresentersStore.set(oneTravelPoint.id, pointPresenter);
    pointPresenter.init(oneTravelPoint);
  }

  #renderTripPoints = (points) => {
    render(this.#sortingComponent, this.#tripPointsListComponent, RenderPosition.AFTEREND);

    points.forEach((oneTravelPoint) => this.#renderOneTripPoint(oneTravelPoint));
  }

  #renderTripBoard = () => {

    if((this.allPoints.length === 0) && this.#addNewBtnStatus.state) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderTripPoints(this.allPoints);

  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#pointPresentersStore.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this.#clearTripBoard();
        this.#renderTripBoard();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearTripBoard(true);
        this.#renderTripBoard();
        break;
    }
  }

  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTripBoard();
    this.#renderTripBoard();
  }

  #handleChangeMode = () => {
    this.#pointPresentersStore.forEach((presenter) => presenter.resetView());
  }

  #clearTripBoard = (resetSortType = false) => {
    this.#pointPresentersStore.forEach((presenter) => presenter.destroy());
    this.#pointPresentersStore.clear();

    remove(this.#sortingComponent);
    remove(this.#pointsEmptyComponent);

    if (resetSortType) {
      this.#currentSortType = SortingLabelStartFrame.DAY.lowCaseWord;
    }
  }

  #setAddNewPoint = () => {
    this.#addNewPointPresenter = new AddNewPointPresenter(
      this.#tripPointsListComponent,
      this.#handleViewAction,
      this.allPoints,
    );

    this.#addNewBtnStatus = this.#addNewPointPresenter.getAddNewBtnStatus();
    this.#newEventBtnComponent.setBtnStatus(this.#addNewBtnStatus);

    this.#newEventBtnComponent.setClickHandler(this.#handleNewPointCreation);
  }

  #handleNewPointCreation = () => {
    this.#addNewBtnStatus = this.#addNewPointPresenter.setAddNewBtnStatus({isAddNewBtn: true, state: true});
    this.#newEventBtnComponent.setBtnStatus(this.#addNewPointPresenter.getAddNewBtnStatus());
    this.#currentSortType = SortingLabelStartFrame.DAY.lowCaseWord;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterLabelStartFrame.EVERYTHING.filter);

    this.#addNewPointPresenter.init();
  }

}
