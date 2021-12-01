import { generateTravelPoints } from './mock/points';
import { RenderPosition, renderTemplate } from './render';
import { createFiltersTemplate } from './view/head/up-filters';
import { createMenuTemplate } from './view/head/up-menu';
import { createTripInfoTemplate } from './view/head/up-trip-info';

const TRAVEL_POINT_COUNT = 10;

const tripPoints = new Array (TRAVEL_POINT_COUNT).fill(' ').map(generateTravelPoints);

const siteHeadInformation = document.querySelector('.trip-main');
const siteNavigation = siteHeadInformation.querySelector('.trip-controls__navigation');

renderTemplate(siteHeadInformation, createTripInfoTemplate(tripPoints), RenderPosition.AFTERBEGIN);
renderTemplate(siteNavigation, createMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteNavigation, createFiltersTemplate(), RenderPosition.BEFOREEND);
