import { EmptyMessageStatement, FilterLabelStartFrame, RenderPosition, SortingLabelStartFrame, UpdateType, UserAction } from '../const';
import { remove, render } from '../render';
import PointsEmptyView from '../view/main-body/points-empty-view';
import SortingListView from '../view/main-body/sorting-list-view';
import PointsListView from '../view/main-body/points-list-view';
import PointPresenter from './point-presenter';
import { sortDate, sortDuration, sortPrice } from '../utils';

export default class TripBoardPresenter {
  #tripBoardContainer = null;
  #pointsModel = null;

  #pointsEmptyEveryComponent = new PointsEmptyView(EmptyMessageStatement.EVERYTHING);
  #pointsEmptyPastComponent = new PointsEmptyView(EmptyMessageStatement.PAST);
  #pointsEmptyFutureComponent = new PointsEmptyView(EmptyMessageStatement.FUTURE);
  #tripPointsListComponent = new PointsListView();
  #sortingComponent = null;

  #currentSortType = SortingLabelStartFrame.DAY.lowCaseWord;
  #pointPresentersStore = new Map();

  constructor(tripBoardContainer, pointsModel) {
    this.#tripBoardContainer = tripBoardContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get allPoints() {
    switch (this.#currentSortType) {
      case SortingLabelStartFrame.DAY.lowCaseWord:
        this.#pointsModel.points.sort(sortDate);
        break;
      case SortingLabelStartFrame.TIME.lowCaseWord:
        this.#pointsModel.points.sort(sortDuration);
        break;
      case SortingLabelStartFrame.PRICE.lowCaseWord:
        this.#pointsModel.points.sort(sortPrice);
        break;
      default:
        return this.#pointsModel.points;
    }

    return this.#pointsModel.points;
  }

  init = () => {
    this.#renderTripBoard();
  }

  #renderSort = () => {
    this.#sortingComponent = new SortingListView(this.#currentSortType);
    this.#sortingComponent.setSortTypeChangeHandler(this.#handleSortChange);

    render(this.#tripBoardContainer, this.#sortingComponent, RenderPosition.BEFOREEND);
  }

  #renderNoPoints = () => {
    const activeFilterStatus =  FilterLabelStartFrame.EVERYTHING.filter;

    const getEmptyMessageAccordingToFilter = (activeFilter) => {
      switch (activeFilter) {
        case FilterLabelStartFrame.EVERYTHING.filter:
          return render(this.#tripBoardContainer, this.#pointsEmptyEveryComponent, RenderPosition.BEFOREEND);
        case FilterLabelStartFrame.PAST.filter:
          return render(this.#tripBoardContainer, this.#pointsEmptyPastComponent, RenderPosition.BEFOREEND);
        case FilterLabelStartFrame.FUTURE.filter:
          return render(this.#tripBoardContainer, this.#pointsEmptyFutureComponent, RenderPosition.BEFOREEND);
        default:
          throw new Error('This filter does not exist in our dataBase');
      }
    };

    getEmptyMessageAccordingToFilter(activeFilterStatus);
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
    if(this.allPoints.length === 0) {
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
    remove(this.#pointsEmptyEveryComponent);
    remove(this.#pointsEmptyPastComponent);
    remove(this.#pointsEmptyFutureComponent);

    if (resetSortType) {
      this.#currentSortType = SortingLabelStartFrame.DAY.lowCaseWord;
    }
  }

}
