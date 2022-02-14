import { AUTHORIZATION, END_POINT, STORE_NAME } from './const';
import HeadSitePresenter from './presenter/head-site-presenter';
import TripBoardPresenter from './presenter/trip-board-presenter';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';
import ApiService from './api/api-service';
import Store from './api/store';
import Provider from './api/provider';

const store = new Store(STORE_NAME, window.localStorage);
const provider =   new Provider(
  new ApiService(END_POINT, AUTHORIZATION),
  store
);
const pointsModel = new PointsModel(provider);
const filterModel = new FilterModel();

const siteHeadInformation = document.querySelector('.trip-main');
const siteNavigation = siteHeadInformation.querySelector('.trip-controls__navigation');
const siteMainDataBody = document.querySelector('.trip-events');
const hideTripEvents = () => siteMainDataBody.classList.add('trip-events--hidden');
const revielTripEvents = () => siteMainDataBody.classList.remove('trip-events--hidden');

const headSitePresenter = new HeadSitePresenter(siteHeadInformation, siteNavigation, siteMainDataBody, pointsModel, filterModel);
const tripBoardPresenter = new TripBoardPresenter(siteMainDataBody, pointsModel, filterModel);


tripBoardPresenter.init();
headSitePresenter.getBoardFunctionality(
  tripBoardPresenter.destroy,
  tripBoardPresenter.init,
  hideTripEvents,
  revielTripEvents);
tripBoardPresenter.getHeadFunctionality(
  headSitePresenter.handleSiteMenuClick,
);

pointsModel.init().finally(() => {
  headSitePresenter.init();
});

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  provider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
