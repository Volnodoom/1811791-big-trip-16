import { NOTHING, RenderPosition, TRAVEL_POINT_COUNT } from './const';
import { generateTravelPoints } from './mock/points';
import { render } from './render';
import UpFiltersView from './view/head/up-filters-view';
import UpMenuView from './view/head/up-menu-view';
import UpTripInfoView from './view/head/up-trip-info-view';
import SortingListView from './view/main-body/sorting-list-view';
import PointsListView from './view/main-body/points-list-view';
import FormEditView from './view/form/form-edit-view';


const tripPoints = new Array (TRAVEL_POINT_COUNT).fill(' ').map(generateTravelPoints);
const dataWithoutFirstValues = tripPoints.filter((_, index) => index > NOTHING );

const siteHeadInformation = document.querySelector('.trip-main');
const siteNavigation = siteHeadInformation.querySelector('.trip-controls__navigation');
const siteMainDataBody = document.querySelector('.trip-events');

render(siteHeadInformation, new UpTripInfoView(tripPoints).element, RenderPosition.AFTERBEGIN);
render(siteNavigation, new UpMenuView().element, RenderPosition.BEFOREEND);
render(siteNavigation, new UpFiltersView().element, RenderPosition.BEFOREEND);

const sortingListComponent = new SortingListView();
const pointsListComponent = new PointsListView(dataWithoutFirstValues);

render(siteMainDataBody, sortingListComponent.element, RenderPosition.BEFOREEND);
render(sortingListComponent.element, pointsListComponent.element, RenderPosition.BEFOREEND);

const formEditContainer = document.querySelector('.trip-events__list');

render(formEditContainer, new FormEditView(tripPoints[0]).element, RenderPosition.AFTERBEGIN);

