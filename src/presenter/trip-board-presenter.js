import { FilterLabelStartFrame, MenuItem, RenderPosition, SortingLabelStartFrame, State, ToastMessage, UpdateType, UserAction } from '../const';
import { remove, render, replace } from '../render';
import PointsEmptyView from '../view/main-body/points-empty-view';
import SortingListView from '../view/main-body/sorting-list-view';
import PointsListView from '../view/main-body/points-list-view';
import LoadingView from '../view/main-body/loading-view';
import PointPresenter from './point-presenter';
import { filterPointsForTimeDifference, isOnline, sortDate, sortDuration, sortPrice } from '../utils';
import NewEventBtnView from '../view/head/new-event-btn-view';
import AddNewPointPresenter from './add-new-point-presenter';
import { toast } from '../toast';

export default class TripBoardPresenter {
  #pointsModel = null;
  #filterModel = null;

  #tripBoardContainer = null;
  #containerForNewEventBtn = null;

  #pointsEmptyComponent = null;
  #tripPointsListComponent = new PointsListView();
  #sortingComponent = null;
  #newEventBtnComponent = null;
  #loadingComponent = new LoadingView();

  #pointPresentersStore = new Map();
  #newPointPresenter = null;
  #currentSortType = SortingLabelStartFrame.DAY.lowCaseWord;
  #filterType = FilterLabelStartFrame.EVERYTHING.filter;
  #isLoading = true;

  #menuClick = null;

  _isAddNewBtnActive = false;

  constructor(tripBoardContainer, pointsModel, filterModel) {
    this.#tripBoardContainer = tripBoardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
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
    this.#renderNewEventBtn();
    this.#newEventBtnComponent.setBtnDisabledStatus(this.#isLoading);
    this.#setAddNewPoint();
    this.#renderTripBoard();

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  #renderNewEventBtn = () => {
    const prevNewEventBtnComponent = this.#newEventBtnComponent;
    this.#newEventBtnComponent = new NewEventBtnView(this.#isLoading);
    this.#containerForNewEventBtn = this.#newEventBtnComponent.getContainerForBtn();

    if (prevNewEventBtnComponent === null) {
      render(this.#containerForNewEventBtn, this.#newEventBtnComponent, RenderPosition.BEFOREEND);
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
      {
        destinations: this.#pointsModel.getListOfDestinations(),
        offers: this.#pointsModel.getListOfOffers(),
      },
    );
    this.#pointPresentersStore.set(oneTravelPoint.id, pointPresenter);
    pointPresenter.init(oneTravelPoint);
    pointPresenter.setPolicyOnePointOneForm(this.#newPointPresenter.handleCloseForm);
  }

  #renderTripPoints = (points) => {
    render(this.#sortingComponent, this.#tripPointsListComponent, RenderPosition.AFTEREND);

    if(points) {
      points.forEach((oneTravelPoint) => this.#renderOneTripPoint(oneTravelPoint));
    }
  }

  #renderTripBoard = () => {
    if(this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if((this.allPoints.length === 0) && !this._isAddNewBtnActive) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderTripPoints(this.allPoints);

  }

  #renderLoading = () => {
    render(this.#tripBoardContainer, this.#loadingComponent, RenderPosition.BEFOREEND);
  }

  #clearTripBoard = (resetSortType = false) => {
    this.#newPointPresenter.destroy();
    this.#pointPresentersStore.forEach((presenter) => presenter.destroy());
    this.#pointPresentersStore.clear();

    remove(this.#sortingComponent);
    remove(this.#pointsEmptyComponent);
    remove(this.#loadingComponent);

    if (resetSortType) {
      this.#currentSortType = SortingLabelStartFrame.DAY.lowCaseWord;
    }
  }

  #setAddNewPoint = () => {
    this.#newPointPresenter = new AddNewPointPresenter(
      this.#tripPointsListComponent,
      this.#handleViewAction,
      this.#handleAddNewPointStatus,
    );

    this.#newPointPresenter.handleForRefreshingBoard(this.#clearTripBoard, this.#renderTripBoard);
    this.#newEventBtnComponent.setClickHandler(this.#handleNewPointCreation);
  }

  getHeadFunctionality = (menuClick) => {
    this.#menuClick = menuClick;
  }

  destroy = () => {
    this.#clearTripBoard(true);

    remove(this.#tripPointsListComponent);

    this.#pointsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresentersStore.get(update.id).setViewState(State.SAVING);
        try{
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresentersStore.get(update.id).setViewState(State.ABORTING);
        }
        break;

      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try{
          await this.#pointsModel.addPoint(updateType, update);
          this.#handleAddNewPointStatus(false);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;

      case UserAction.DELETE_POINT:
        this.#pointPresentersStore.get(update.id).setViewState(State.DELETING);
        try{
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresentersStore.get(update.id).setViewState(State.ABORTING);
        }
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresentersStore.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTripBoard();
        this.#renderTripBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearTripBoard(true);
        this.#renderTripBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#newEventBtnComponent.setBtnDisabledStatus(this.#isLoading);
        remove(this.#loadingComponent);
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

  #handleNewPointCreation = () => {
    if (!isOnline()) {
      toast(ToastMessage.ADD_NEW_POINT);
      return;
    }

    this.#menuClick(MenuItem.TABLE);
    this.#handleAddNewPointStatus(true);
    this.#newEventBtnComponent.setBtnDisabledStatus(this._isAddNewBtnActive);
    this.#currentSortType = SortingLabelStartFrame.DAY.lowCaseWord;

    if(this.#filterType !== FilterLabelStartFrame.EVERYTHING.filter) {
      this.#filterModel.setFilter(UpdateType.MAJOR, FilterLabelStartFrame.EVERYTHING.filter);
    }

    this.#newPointPresenter.setTemplateForAddNewBtnStatus(true);
    this.#handleChangeMode();

    if (this.allPoints.length === 0) {
      remove(this.#pointsEmptyComponent);
      this.#renderSort();
      this.#renderTripPoints();

    }

    this.#newPointPresenter.init(
      {
        destinations: this.#pointsModel.getListOfDestinations(),
        offers: this.#pointsModel.getListOfOffers(),
      },
      this.allPoints.length === 0,
    );
  }

  #handleAddNewPointStatus = (isActive) => {
    this._isAddNewBtnActive = isActive;
    this.#newEventBtnComponent.setBtnDisabledStatus(isActive);
  }
}
