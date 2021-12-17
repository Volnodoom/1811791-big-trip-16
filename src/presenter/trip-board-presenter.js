import { EmptyMessageStatement, FilterLabelStartFrame, RenderPosition, SortingLabelStartFrame } from '../const';
import { render } from '../render';
import PointsEmptyView from '../view/main-body/points-empty-view';
import SortingListView from '../view/main-body/sorting-list-view';
import PointsListView from '../view/main-body/points-list-view';
import PointPresenter from './point-presenter';
import { sortDate, sortDuration, sortPrice, updateArrayItem } from '../utils';

export default class TripBoardPresenter {
  #tripBoardContainer = null;

  #pointsEmptyEveryComponent = new PointsEmptyView(EmptyMessageStatement.EVERYTHING);
  #pointsEmptyPastComponent = new PointsEmptyView(EmptyMessageStatement.PAST);
  #pointsEmptyFutureComponent = new PointsEmptyView(EmptyMessageStatement.FUTURE);
  #sortingComponent = new SortingListView();
  #tripPointsListComponent = new PointsListView();

  #tripPoints = [];

  #pointPresentersStore = new Map();
  #currentSortType = SortingLabelStartFrame.DAY.lowCaseWord;

  constructor(tripBoardContainer) {
    this.#tripBoardContainer = tripBoardContainer;
  }

  init = (travelPoints) => {
    this.#tripPoints = [...travelPoints];
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
      this.#handlePointUpdate,
      this.#handleChangeMode);
    pointPresenter.init(oneTravelPoint);
    this.#pointPresentersStore.set(oneTravelPoint.id, pointPresenter);
  }

  #renderTripPoints = () => {
    render(this.#sortingComponent, this.#tripPointsListComponent, RenderPosition.AFTEREND);

    this.#tripPoints.forEach((oneTravelPoint) => this.#renderOneTripPoint(oneTravelPoint));
  }

  #renderTripBoard = () => {
    if(this.#tripPoints.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderTripPoints();

  }

  #handlePointUpdate = (update) => {
    this.#tripPoints = updateArrayItem(this.#tripPoints, update);
    this.#pointPresentersStore.get(update.id).init(update);
  }

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortingLabelStartFrame.DAY.lowCaseWord:
        this.#tripPoints.sort(sortDate);
        break;
      case SortingLabelStartFrame.TIME.lowCaseWord:
        this.#tripPoints.sort(sortDuration);
        break;
      case SortingLabelStartFrame.PRICE.lowCaseWord:
        this.#tripPoints.sort(sortPrice);
        break;
      default:
        throw new Error('Please, specify your Sorting time in TRIP-BOARD-PRESENTER file!');
    }

    this.#currentSortType = sortType;
  }

  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
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
