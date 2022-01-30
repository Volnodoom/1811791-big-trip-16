import { ListOfEventsOn, NOTHING } from '../../const';
import { durationOfEventInMinutes, durationOfOnePointEvent, getTimeHHMM, getTimeMMDD, getTimeYYYYMMDD, getTimeYYYYMMDDHHMM } from '../../utils';
import Abstract from '../abstract';

const createSinglePointTemplate = (oneTravelPoint) => {
  const {destinationName} = oneTravelPoint.destination;
  const {offers} = oneTravelPoint;
  const {
    id,
    dateFrom,
    dateTo,
    travelType,
    basePrice,
    isFavorite} = oneTravelPoint;

  const differenceInMinutes = durationOfEventInMinutes(dateFrom, dateTo);
  const offersList = () => offers
    .map((offer) => `<li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </li>`)
    .join(' ');


  return `<li class="trip-events__item" data-pointId="${id}">
  <div class="event">

    <time
    class="event__date"
    datetime="${getTimeYYYYMMDD(dateFrom)}"
    >
    ${getTimeMMDD(dateFrom)}
    </time>

    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${travelType}.png" alt="Event ${travelType} icon">
    </div>

    <h3 class="event__title">
    ${travelType.replace(travelType[0], travelType[0].toUpperCase())} ${destinationName}
    </h3>

    <div class="event__schedule">
      <p class="event__time">

        <time
        class="event__start-time"
        datetime="${getTimeYYYYMMDDHHMM(dateFrom)}"
        >
        ${getTimeHHMM(dateFrom)}
        </time>
        &mdash;
        <time
        class="event__end-time"
        datetime="${getTimeYYYYMMDDHHMM(dateTo)}"
        >
        ${getTimeHHMM(dateTo)}
        </time>

      </p>

      <p class="event__duration">${durationOfOnePointEvent(differenceInMinutes)}</p>
    </div>

    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">

    ${offers.length > NOTHING ? offersList() :'' }

    </ul>

    <button
    class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ' '}"
    type="button"
    data-favorite-btn="${ListOfEventsOn.FAVORITE_BTN}"
    >
    <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>

    <button
    class="event__rollup-btn"
    type="button"
    data-single-rollup="${ListOfEventsOn.ROLLUP_BTN}"
    >
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
};

export default class SinglePointView extends Abstract {
  #oneTravelPoint = null;

  constructor(oneTravelPoint) {
    super();
    this.#oneTravelPoint = oneTravelPoint;
  }

  get template() {
    return createSinglePointTemplate(this.#oneTravelPoint);
  }

  setClickHandler = (type, callback) =>  {
    switch (type) {
      case ListOfEventsOn.ROLLUP_BTN:
        this._callback.clickOnRollUpBtnPoint = callback;
        this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
        break;
      case ListOfEventsOn.FAVORITE_BTN:
        this._callback.clickOnFavoriteBtn = callback;
        this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#clickHandler);
        break;
      default:
        throw new Error('ClickHandler for SINGLE-POINT_VIEW does not contain such TYPE of callback');
    }
  }

  #clickHandler = (evt) => {
    switch (true) {
      case (evt.target.dataset.singleRollup === ListOfEventsOn.ROLLUP_BTN):
        this._callback.clickOnRollUpBtnPoint();
        break;
      case (evt.currentTarget.dataset.favoriteBtn === ListOfEventsOn.FAVORITE_BTN):
        this._callback.clickOnFavoriteBtn();
        break;
    }
  }
}

