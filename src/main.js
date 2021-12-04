import { RenderPosition, TRAVEL_POINT_COUNT } from './const';
import { generateTravelPoints } from './mock/points';
import { render } from './render';
import UpFiltersView from './view/head/up-filters-view';
import UpMenuView from './view/head/up-menu-view';
import UpTripInfoView from './view/head/up-trip-info-view';
import SortingListView from './view/main-body/sorting-list-view';
import PointsListView from './view/main-body/points-list-view';
import FormEditView from './view/form/form-edit-view';
import SinglePointView from './view/main-body/single-point-view';
import { isEsc } from './utils';


const tripPoints = new Array (TRAVEL_POINT_COUNT).fill(' ').map(generateTravelPoints);

const siteHeadInformation = document.querySelector('.trip-main');
const siteNavigation = siteHeadInformation.querySelector('.trip-controls__navigation');
const siteMainDataBody = document.querySelector('.trip-events');

render(siteHeadInformation, new UpTripInfoView(tripPoints).element, RenderPosition.AFTERBEGIN);
render(siteNavigation, new UpMenuView().element, RenderPosition.BEFOREEND);
render(siteNavigation, new UpFiltersView().element, RenderPosition.BEFOREEND);

const sortingListComponent = new SortingListView();

render(siteMainDataBody, sortingListComponent.element, RenderPosition.BEFOREEND);

const renderSinglePoint = (container, oneTravelPoint) => {
  const singlePointComponent = new SinglePointView(oneTravelPoint);
  const pointFormEditComponent = new FormEditView(oneTravelPoint);

  const replacePointToFormEdit = () => {
    container.replaceChild(pointFormEditComponent.element, singlePointComponent.element);
  };

  const replaceFormEditToPoint = () => {
    container.replaceChild(singlePointComponent.element, pointFormEditComponent.element);
  };

  const escKeyDownHandler = (evt) => {
    if(isEsc(evt)) {
      evt.preventDefault();
      replaceFormEditToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
      pointFormEditComponent.removeElement();
    }
  };

  const editFormRollUpHandler = () => {
    replaceFormEditToPoint();
    document.removeEventListener('keydown', escKeyDownHandler);
    pointFormEditComponent.removeElement();
  };

  singlePointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointToFormEdit();
    document.addEventListener('keydown', escKeyDownHandler);
    pointFormEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', editFormRollUpHandler);
  });

  pointFormEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormEditToPoint();
    document.removeEventListener('keydown', escKeyDownHandler);
    pointFormEditComponent.removeElement();
  });

  render(container, singlePointComponent.element, RenderPosition.BEFOREEND);
};

const renderPointsList = (points) => {
  const pointsListComponent = new PointsListView();

  render(sortingListComponent.element, pointsListComponent.element, RenderPosition.AFTEREND);

  points.forEach((oneTravelPoint) => renderSinglePoint(pointsListComponent.element, oneTravelPoint));

};

renderPointsList(tripPoints);

