import { EmptyMessageStatement, FilterLabelStartFrame, ListOfEventsOn, NOTHING, RenderPosition, TRAVEL_POINT_COUNT } from './const';
import { generateTravelPoints } from './mock/points';
import { remove, render, replace } from './render';
import UpFiltersView from './view/head/up-filters-view';
import UpMenuView from './view/head/up-menu-view';
import UpTripInfoView from './view/head/up-trip-info-view';
import SortingListView from './view/main-body/sorting-list-view';
import PointsListView from './view/main-body/points-list-view';
import FormEditView from './view/form/form-edit-view';
import SinglePointView from './view/main-body/single-point-view';
import { getRandomInteger } from './utils';
import PointsEmptyView from './view/main-body/points-empty-view';


const tripPoints = new Array ([TRAVEL_POINT_COUNT, NOTHING][getRandomInteger(0, 1)]).fill(' ').map(generateTravelPoints);

const siteHeadInformation = document.querySelector('.trip-main');
const siteNavigation = siteHeadInformation.querySelector('.trip-controls__navigation');
const siteMainDataBody = document.querySelector('.trip-events');

if (tripPoints.length > 0) {
  render(siteHeadInformation, new UpTripInfoView(tripPoints), RenderPosition.AFTERBEGIN);
}

render(siteNavigation, new UpMenuView(), RenderPosition.BEFOREEND);
render(siteNavigation, new UpFiltersView(), RenderPosition.BEFOREEND);

if(tripPoints.length === 0) {
  const activeFilterStatus =  FilterLabelStartFrame.EVERYTHING.filter;
  const getEmptyMessageAccordingToFilter = (activeFilter) => {
    switch (activeFilter) {
      case FilterLabelStartFrame.EVERYTHING.filter:
        return render(siteMainDataBody, new PointsEmptyView(EmptyMessageStatement.EVERYTHING), RenderPosition.BEFOREEND);
      case FilterLabelStartFrame.PAST.filter:
        return render(siteMainDataBody, new PointsEmptyView(EmptyMessageStatement.PAST), RenderPosition.BEFOREEND);
      case FilterLabelStartFrame.FUTURE.filter:
        return render(siteMainDataBody, new PointsEmptyView(EmptyMessageStatement.FUTURE), RenderPosition.BEFOREEND);
      default:
        throw new Error('This filter does not exist in our dataBase');
    }
  };

  getEmptyMessageAccordingToFilter(activeFilterStatus);
} else {

  const sortingListComponent = new SortingListView();

  render(siteMainDataBody, sortingListComponent, RenderPosition.BEFOREEND);

  const renderSinglePoint = (container, oneTravelPoint) => {
    const singlePointComponent = new SinglePointView(oneTravelPoint);
    const pointFormEditComponent = new FormEditView(oneTravelPoint);

    const closeForm = () => {
      replace(singlePointComponent, pointFormEditComponent);
      remove(pointFormEditComponent);
    };

    const openForm = () => {
      replace(pointFormEditComponent, singlePointComponent);
    };

    singlePointComponent.setClickHandler(() => {
      openForm();
      pointFormEditComponent.setEscPressHandler(closeForm);
      pointFormEditComponent.setClickHandler(ListOfEventsOn.ROLLUP_BTN_FORM ,closeForm);
      pointFormEditComponent.setSubmitHandler(closeForm);
    }
    );

    render(container, singlePointComponent, RenderPosition.BEFOREEND);
  };

  const renderPointsList = (points) => {
    const pointsListComponent = new PointsListView();

    render(sortingListComponent, pointsListComponent, RenderPosition.AFTEREND);

    points.forEach((oneTravelPoint) => renderSinglePoint(pointsListComponent, oneTravelPoint));

  };

  renderPointsList(tripPoints);
}
