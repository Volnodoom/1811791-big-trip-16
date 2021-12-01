import { getTimeMMDD } from '../../utils';

export const createTripInfoTemplate = (travelPoints) => {
  const LIMIT_TOWN_INFO = 3;

  const reducer = (previousValue, currentValue) => previousValue + currentValue;

  const totalPriceWithoutOffers = [];
  travelPoints
    .slice()
    .forEach((point) => totalPriceWithoutOffers.push(point.basePrice));

  const getTripDescription = () => {
    const resultedDestination = [];

    travelPoints.slice().forEach((point) => resultedDestination.push(point.destination.destinationName));
    return resultedDestination.join(' &mdash; ');
  };

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">
    ${travelPoints.length <= LIMIT_TOWN_INFO
    ? getTripDescription()
    : `${travelPoints[0].destination.destinationName}  &mdash; ... &mdash; ${travelPoints[travelPoints.length-1].destination.destinationName}`}
      </h1>
      <p class="trip-info__dates">${getTimeMMDD(travelPoints[0].dateFrom)}&nbsp;&mdash;&nbsp;${getTimeMMDD(travelPoints[travelPoints.length-1].dateTo)}</p>
    </div>
    <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPriceWithoutOffers.reduce(reducer)}</span>
    </p>
  </section>`;
};
