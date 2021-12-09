import { NOTHING, TRAVEL_POINT_COUNT } from './const';
import { generateTravelPoints } from './mock/points';
import { getRandomInteger } from './utils';
import HeadSitePresenter from './presenter/head-site-presenter';
import TripBoardPresenter from './presenter/trip-board-presenter';

const tripPoints = new Array ([TRAVEL_POINT_COUNT, NOTHING][getRandomInteger(0, 1)]).fill(' ').map(generateTravelPoints);

const siteHeadInformation = document.querySelector('.trip-main');
const siteNavigation = siteHeadInformation.querySelector('.trip-controls__navigation');
const siteMainDataBody = document.querySelector('.trip-events');

const headSitePresenter = new HeadSitePresenter(siteHeadInformation, siteNavigation);
const tripBoardPresenter = new TripBoardPresenter(siteMainDataBody);

headSitePresenter.init(tripPoints);
tripBoardPresenter.init(tripPoints);
