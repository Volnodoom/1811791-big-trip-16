import { NOTHING, RenderPosition, TRAVEL_POINT_COUNT } from './const';
import { generateTravelPoints } from './mock/points';
import { renderTemplate } from './render';
import { createFormEditingTemplate } from './view/form/form-edit-view';
import { createFiltersTemplate } from './view/head/up-filters';
import { createMenuTemplate } from './view/head/up-menu';
import { createTripInfoTemplate } from './view/head/up-trip-info';
import { createPointListDestinationTemplate } from './view/main-body/sorting-list';

const tripPoints = new Array (TRAVEL_POINT_COUNT).fill(' ').map(generateTravelPoints);

const siteHeadInformation = document.querySelector('.trip-main');
const siteNavigation = siteHeadInformation.querySelector('.trip-controls__navigation');
const siteMainDataBody = document.querySelector('.trip-events');

renderTemplate(siteHeadInformation, createTripInfoTemplate(tripPoints), RenderPosition.AFTERBEGIN);
renderTemplate(siteNavigation, createMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteNavigation, createFiltersTemplate(), RenderPosition.BEFOREEND);

const dataWithoutFirstValues = tripPoints.filter((_, index) => index > NOTHING );

renderTemplate(siteMainDataBody, createPointListDestinationTemplate(dataWithoutFirstValues), RenderPosition.BEFOREEND);

const formEditForFirstLine = document.querySelector('.trip-events__list');

renderTemplate(formEditForFirstLine, createFormEditingTemplate(tripPoints[0]), RenderPosition.AFTERBEGIN);

