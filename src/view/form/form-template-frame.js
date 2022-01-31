import { EventDescription, FormBtnNaming, ListOfEventsOn } from '../../const';
import { getTimeDDMMYYWithSlashAndHHMM } from '../../utils';

export const createHeaderFormTemplate = (pointData, listOfOptions, addNewBtnState) => {
  const {destinationName} = pointData.destination;
  const {
    dateFrom,
    dateTo,
    travelType,
    basePrice,
    id,
    isDisabled,
    isSaving,
    isDeleting,
  } = pointData;

  const createCanselDeleteBtnTemplate = () => {
    if (addNewBtnState) {
      return FormBtnNaming.CANCEL;
    } else {
      if (isDeleting) {
        return FormBtnNaming.DELETING;
      }}

    return FormBtnNaming.DELETE;
  };

  const listOfDestination = listOfOptions.destinations
    .map((onePoint) => `<option value="${onePoint.destinationName}"></option>`).join(' ');

  const getSingleEvent = (eventInfo) => (
    `<div class="event__type-item">

      <input
        id="event-type-${eventInfo.lowCaseWord}-${id}"
        class="event__type-input  visually-hidden"
        type="radio" 
        name="event-type"
        value="${eventInfo.lowCaseWord}"
        ${isDisabled ? 'disabled' : ''}
        />

      <label class="event__type-label  event__type-label--${eventInfo.lowCaseWord}"
      for="event-type-${eventInfo.lowCaseWord}-${id}"
      data-event-type = "${ListOfEventsOn.EVENT_TYPE}"
      >${eventInfo.capitalLetterWord}</label>

    </div>`
  );

  const listOfSingleEvents =  Object
    .values(EventDescription)
    .map((description) => getSingleEvent(description))
    .join(' ');

  return `  <header class="event__header">
  <div class="event__type-wrapper">
    <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
      <span class="visually-hidden">Choose event type</span>

      <img
      class="event__type-icon"
      width="17"
      height="17"
      src="img/icons/${travelType}.png"
      alt="Event ${travelType} icon">

      </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

    <div class="event__type-list">
      <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>

    ${listOfSingleEvents}

      </fieldset>
    </div>

  </div>

  <div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output"
    for="event-destination-${id}"
    data-destination-point="${ListOfEventsOn.DESTINATION_POINT}">
    ${travelType.replace(travelType[0], travelType[0].toUpperCase())}
    </label>

    <input
    class="event__input  event__input--destination"
    id="event-destination-${id}"
    type="text"
    name="event-destination"
    value="${destinationName}"
    list="destination-list-${id}"
    ${isDisabled ? 'disabled' : ''}
    >

    <datalist id="destination-list-${id}">
      ${listOfDestination}
    </datalist>
  </div>

  <div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-${id}">From</label>

    <input
    class="event__input  event__input--time"
    id="event-start-time-${id}"
    type="text"
    name="event-start-time"
    value="${getTimeDDMMYYWithSlashAndHHMM(dateFrom)}"
    ${isDisabled ? 'disabled' : ''}
    >
    &mdash;
    <label class="visually-hidden" for="event-end-time-${id}">To</label>

    <input
    class="event__input  event__input--time"
    id="event-end-time-${id}" type="text"
    name="event-end-time"
    value="${getTimeDDMMYYWithSlashAndHHMM(dateTo)}"
    ${isDisabled ? 'disabled' : ''}
    >

  </div>

  <div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-${id}">
      <span class="visually-hidden">Price</span>
      &euro;
    </label>

    <input
    class="event__input  event__input--price"
    id="event-price-${id}"
    type="text"
    name="event-price"
    value="${basePrice}"
    ${isDisabled ? 'disabled' : ''}>

    </div>

  <button 
  class="event__save-btn  btn  btn--blue" 
  type="submit" 
  ${isDisabled ? 'disabled' : ''}>
    ${isSaving ? 'Saving...' : 'Save'}
  </button>

  <button 
  class="event__reset-btn" 
  type="reset"
  ${isDisabled ? 'disabled' : ''}>
    ${createCanselDeleteBtnTemplate()}
  </button>

  ${addNewBtnState
    ? ''
    : `<button class="event__rollup-btn" type="button" data-close-rollup-form="${ListOfEventsOn.CLOSE_ROLLUP_BTN}"> <span class="visually-hidden">Open event</span> </button>`}

</header>`;
};

export const createSectionOfferTemplate = (oneTravelPoint, listOfOptions) => {
  const {travelType} = oneTravelPoint;
  const offersFromCustomer = oneTravelPoint.offers;
  const offersList = listOfOptions.offers;

  const currentOfferFromList = offersList.find((oneOffer) => oneOffer.type === travelType);

  const getSingleOfferButton = (oneOffer) => {
    const {title, price, id} = oneOffer;

    const isSelected = () => {
      if (offersFromCustomer.length === 0) {
        return false;
      }

      return offersFromCustomer.some((customerSelection) => customerSelection.id === oneOffer.id);
    };

    return `<div class="event__offer-selector">
    <input
    class="event__offer-checkbox  visually-hidden"
    id="event-offer-${id}"
    type="checkbox"
    name="event-offer"
    ${isSelected() ? 'checked' : ''}
    >

    <label 
    class="event__offer-label" 
    for="event-offer-${id}"
    data-event-offer="${ListOfEventsOn.OFFER_BTN}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>`;
  };

  const listOfOffers = currentOfferFromList.offers
    .map((oneOffer) => getSingleOfferButton(oneOffer))
    .join(' ');


  return `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>

  <div class="event__available-offers">${listOfOffers}</div>
</section>`;
};

export const createFormDestinationTemplate = (oneTravelPoint) => {
  const {description, pictures} = oneTravelPoint.destination;

  const pictureList = pictures
    .map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`)
    .join(' ');

  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictureList}
      </div>
    </div>
  </section>`;
};
