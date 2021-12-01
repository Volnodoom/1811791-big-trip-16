import { generateTravelPoints } from './mock/points';
import { RenderPosition, renderTemplate } from './render';
import { createFormEditingTemplate } from './view/form/form-editing';
import { createFiltersTemplate } from './view/head/up-filters';
import { createMenuTemplate } from './view/head/up-menu';
import { createTripInfoTemplate } from './view/head/up-trip-info';
import { createPointListDestinationTemplate } from './view/main-body/points-list-destination';

const TRAVEL_POINT_COUNT = 3;

const tripPoints = new Array (TRAVEL_POINT_COUNT).fill(' ').map(generateTravelPoints);

const siteHeadInformation = document.querySelector('.trip-main');
const siteNavigation = siteHeadInformation.querySelector('.trip-controls__navigation');
const siteMainDataBody = document.querySelector('.trip-events');

renderTemplate(siteHeadInformation, createTripInfoTemplate(tripPoints), RenderPosition.AFTERBEGIN);
renderTemplate(siteNavigation, createMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteNavigation, createFiltersTemplate(), RenderPosition.BEFOREEND);

renderTemplate(siteMainDataBody, createPointListDestinationTemplate(tripPoints), RenderPosition.BEFOREEND);

const formEditForFirstLine = document.querySelector('.trip-events__item');

renderTemplate(formEditForFirstLine, createFormEditingTemplate(tripPoints[0]), RenderPosition.BEFOREEND);

