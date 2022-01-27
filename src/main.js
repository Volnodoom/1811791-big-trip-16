import { NOTHING, TRAVEL_POINT_COUNT } from './const';
import { generateTravelPoints } from './mock/points';
import { getRandomInteger } from './utils';
import HeadSitePresenter from './presenter/head-site-presenter';
import TripBoardPresenter from './presenter/trip-board-presenter';
import PointesModel from './model/points-model';
import FilterModel from './model/filter-model';

const tripPoints = new Array ([TRAVEL_POINT_COUNT, NOTHING][getRandomInteger(0, 1)]).fill(' ').map(generateTravelPoints);

const pointsModel = new PointesModel();
pointsModel.points = tripPoints;

const filterModel = new FilterModel();

const siteHeadInformation = document.querySelector('.trip-main');
const siteNavigation = siteHeadInformation.querySelector('.trip-controls__navigation');
const siteMainDataBody = document.querySelector('.trip-events');
const hideTripEvents = () => siteMainDataBody.classList.add('trip-events--hidden');
const revielTripEvents = () => siteMainDataBody.classList.remove('trip-events--hidden');

const headSitePresenter = new HeadSitePresenter(siteHeadInformation, siteNavigation, siteMainDataBody, pointsModel, filterModel);
const tripBoardPresenter = new TripBoardPresenter(siteMainDataBody, pointsModel, filterModel);

headSitePresenter.init();
tripBoardPresenter.init();
headSitePresenter.getBoardFunctionality(
  tripBoardPresenter.destroy,
  tripBoardPresenter.init,
  hideTripEvents,
  revielTripEvents,);
tripBoardPresenter.getHeadFunctionality(
  headSitePresenter.handleSiteMenuClick,
);
