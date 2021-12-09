import { EmptyMessageStatement, FilterLabelStartFrame, RenderPosition } from '../const';
import { render } from '../render';
import PointsEmptyView from '../view/main-body/points-empty-view';
import SortingListView from '../view/main-body/sorting-list-view';
import PointsListView from '../view/main-body/points-list-view';
import PointPresenter from './point-presenter';

export default class TripBoardPresenter {
  #tripBoardContainer = null;

  #pointsEmptyEveryComponent = new PointsEmptyView(EmptyMessageStatement.EVERYTHING);
  #pointsEmptyPastComponent = new PointsEmptyView(EmptyMessageStatement.PAST);
  #pointsEmptyFutureComponent = new PointsEmptyView(EmptyMessageStatement.FUTURE);
  #sortingComponent = new SortingListView();
  #tripPointsListComponent = new PointsListView();

  #tripPoints = [];

  constructor(tripBoardContainer) {
    this.#tripBoardContainer = tripBoardContainer;
  }

  init = (travelPoints) => {
    this.#tripPoints = [...travelPoints];
    this.#renderTripBoard();
  }

  #renderSort = () => {

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
    const pointPresenter = new PointPresenter(this.#tripPointsListComponent);
    pointPresenter.init(oneTravelPoint);
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
}
