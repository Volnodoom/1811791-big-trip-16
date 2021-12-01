import { getTimeDDMMYYWithSlashAndHHMM } from '../../utils';
import { createFieldsetEventTypeListTemplate } from './fieldset-event-type-list';

export const createHeaderFormTemplate = (oneTravelPoint) => {
  const {destinationName} = oneTravelPoint.destination;
  const {
    dateFrom,
    dateTo,
    travelType,
    basePrice,
  } = oneTravelPoint;

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

    ${createFieldsetEventTypeListTemplate()}

  </div>

  <div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
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
      <option value="Amsterdam"></option>
      <option value="Geneva"></option>
      <option value="Chamonix"></option>
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
  <button class="event__reset-btn" type="reset">Delete</button>
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
</header>`;
};
