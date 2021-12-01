import { durationOfEventInMinutes, getTimeHHMM, getTimeMMDD, getTimeYYYYMMDD, getTimeYYYYMMDDHHMM } from '../../utils';

export const createSinglePointDestinationTemplate = (oneTravelPoint) => {
  const {destinationName} = oneTravelPoint.destination;
  const {offers} = oneTravelPoint;
  const {
    dateFrom,
    dateTo,
    travelType,
    basePrice,
    isFavorite} = oneTravelPoint;

  const getListOfOffers = () => {
    const result = [];

    if (offers) {
      offers
        .slice()
        .forEach((offer) => result.push(`<li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </li>`));

      return result.join(' ');
    } else {return ' ';}
  };


  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${getTimeYYYYMMDD(dateFrom)}">${getTimeMMDD(dateFrom)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${travelType}.png" alt="Event ${travelType} icon">
    </div>
    <h3 class="event__title">${travelType.replace(travelType[0], travelType[0].toUpperCase())} ${destinationName}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${getTimeYYYYMMDDHHMM(dateFrom)}">${getTimeHHMM(dateFrom)}</time>
        &mdash;
        <time class="event__end-time" datetime="${getTimeYYYYMMDDHHMM(dateTo)}">${getTimeHHMM(dateTo)}</time>
      </p>
      <p class="event__duration">${durationOfEventInMinutes(dateFrom, dateTo)}M</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${getListOfOffers()}
    </ul>
    <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ' '}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
};
