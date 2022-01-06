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

const headSitePresenter = new HeadSitePresenter(siteHeadInformation, siteNavigation);
const tripBoardPresenter = new TripBoardPresenter(siteMainDataBody, pointsModel);

//we also need to correct head on the same was as we did with board presenter
headSitePresenter.init(tripPoints);
tripBoardPresenter.init();
