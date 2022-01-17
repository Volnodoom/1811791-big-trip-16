import { CHECK_IN, CHECK_IN_SPECIFIC, EventDescription, ListOfEventsOn, NOTHING } from '../../const';
import { findCurrentOfferForUser, getTimeDDMMYYWithSlashAndHHMM } from '../../utils';

export const createHeaderFormTemplate = (oneTravelPoint, destinationList, addNewBtnState) => {
  const {destinationName} = oneTravelPoint.destination;
  const {
    dateFrom,
    dateTo,
    travelType,
    basePrice,
    offers,
  } = oneTravelPoint;

  const isBlankPoint = addNewBtnState.isAddNewBtn;


  const list = destinationList.map((onePoint) => `<option value="${onePoint.destination.destinationName}"></option>`);

  const getSingleEvent = (eventInfo) => (
    `<div class="event__type-item">

      <input
        id="event-type-${eventInfo.lowCaseWord}-1"
        class="event__type-input  visually-hidden"
        type="radio" name="event-type"
        value="${eventInfo.lowCaseWord}"
        />

      <label class="event__type-label  event__type-label--${eventInfo.lowCaseWord}"
      for="event-type-${eventInfo.lowCaseWord}-1"
      data-event-type = "${ListOfEventsOn.EVENT_TYPE}"
      >${eventInfo.capitalLetterWord}</label>

    </div>`
  );

  const getListOfEventsForThePoint = () => offers.map((offer) => {
    if (offer.type.toUpperCase() !== CHECK_IN) {
      return EventDescription[offer.type.toUpperCase()];
    } else {
      return EventDescription[CHECK_IN_SPECIFIC];
    }
  });

  return `  <header class="event__header">
  <div class="event__type-wrapper">
    <label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>

      <img
      class="event__type-icon"
      width="17"
      height="17"
      src="img/icons/${travelType}.png"
      alt="Event ${travelType} icon">

      </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

    <div class="event__type-list">
      <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>

    ${getListOfEventsForThePoint()
    .map((description) => getSingleEvent(description))
    .join(' ')}

      </fieldset>
    </div>

  </div>

  <div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output"
    for="event-destination-1"
    data-destination-point="${ListOfEventsOn.DESTINATION_POINT}">
    ${travelType.replace(travelType[0], travelType[0].toUpperCase())}
    </label>

    <input
    class="event__input  event__input--destination"
    id="event-destination-1"
    type="text"
    name="event-destination"
    value="${destinationName}"
    list="destination-list-1"
    >

    <datalist id="destination-list-1">
      ${list.join(' ')}
    </datalist>
  </div>

  <div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>

    <input
    class="event__input  event__input--time"
    id="event-start-time-1"
    type="text"
    name="event-start-time"
    value="${getTimeDDMMYYWithSlashAndHHMM(dateFrom)}"
    >
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>

    <input
    class="event__input  event__input--time"
    id="event-end-time-1" type="text"
    name="event-end-time"
    value="${getTimeDDMMYYWithSlashAndHHMM(dateTo)}"
    >

  </div>

  <div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-1">
      <span class="visually-hidden">Price</span>
      &euro;
    </label>

    <input
    class="event__input  event__input--price"
    id="event-price-1"
    type="text"
    name="event-price"
    value="${basePrice}"
    >

    </div>

  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
  <button class="event__reset-btn" type="reset">${isBlankPoint ? 'Cancel' : 'Delete'}</button>

  ${isBlankPoint ? '' : `<button class="event__rollup-btn" type="button" data-close-rollup-form="${ListOfEventsOn.CLOSE_ROLLUP_BTN}"> <span class="visually-hidden">Open event</span> </button>`}

</header>`;
};

export const createSectionOfferTemplate = (oneTravelPoint) => {
  const {offers, travelType} = oneTravelPoint;
  let offerList = '';

  const singleOfferButton = (oneOffer) => {
    const {title, price, id} = oneOffer;

    return `<div class="event__offer-selector">
    <input
    class="event__offer-checkbox  visually-hidden"
    id="event-offer-luggage-${id}"
    type="checkbox"
    name="event-offer-luggage"
    >

    <label class="event__offer-label" for="event-offer-luggage-${id}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>`;
  };

  if (offers.length !== NOTHING) {
    offerList = findCurrentOfferForUser(offers, travelType).map((oneOffer) => singleOfferButton(oneOffer));
  }

  return `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>

  <div class="event__available-offers">${offers.length !== NOTHING ? offerList.join(' ') : ''}</div>
</section>`;
};

export const createFormDestinationTemplate = (oneTravelPoint) => {
  const {description, pictures} = oneTravelPoint.destination;

  const pictureList = pictures
    .map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`);

  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictureList.join(' ')}
      </div>
    </div>
  </section>`;
};
