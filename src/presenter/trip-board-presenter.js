import { EmptyMessageStatement, FilterLabelStartFrame, RenderPosition, SortingLabelStartFrame } from '../const';
import { render } from '../render';
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
  #sortingComponent = new SortingListView();
  #tripPointsListComponent = new PointsListView();

  #pointPresentersStore = new Map();
  #currentSortType = SortingLabelStartFrame.DAY.lowCaseWord;

  constructor(tripBoardContainer, pointsModel) {
    this.#tripBoardContainer = tripBoardContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get allPoints() {
    switch (this.#currentSortType) {
      case SortingLabelStartFrame.DAY.lowCaseWord:
        [...this.#pointsModel.points].sort(sortDate);
        break;
      case SortingLabelStartFrame.TIME.lowCaseWord:
        [...this.#pointsModel.points].sort(sortDuration);
        break;
      case SortingLabelStartFrame.PRICE.lowCaseWord:
        [...this.#pointsModel.points].sort(sortPrice);
        break;
      default:
        throw new Error('Please, specify your Sorting time in TRIP-BOARD-PRESENTER file!');
    }

    return this.#pointsModel.points;
  }

  init = () => {
    this.#renderTripBoard();
  }

  #renderSort = () => {
    render(this.#tripBoardContainer, this.#sortingComponent, RenderPosition.BEFOREEND);
    this.#sortingComponent.setSortTypeChangeHandler(this.#handleSortChange);
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

  }

  #handleModelEvent = (updateType, data) => {

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

  #clearTripBoard = () => {
    this.#pointPresentersStore.forEach((presenter) => presenter.destroy());
    this.#pointPresentersStore.clear();
  }

}
