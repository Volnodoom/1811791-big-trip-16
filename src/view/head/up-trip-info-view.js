import { LIMIT_TOWN_INFO, NOTHING } from '../../const';
import { getTimeMMDD } from '../../utils';
import Abstract from '../abstract';

const createTripInfoTemplate = (travelPoints) => {
  const totalPrice = travelPoints
    .reduce((accumulator, point) => {
      if (point.offers.length > NOTHING) {
        return Number(accumulator)
        + Number(point.basePrice)
        + Number(point.offers
          .reduce((accumulatorOffer, offer) => Number(accumulatorOffer) + Number(offer.price), NOTHING));
      } else {
        return Number(accumulator) + Number(point.basePrice);
      }
    }, NOTHING);

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">
    ${travelPoints.length <= LIMIT_TOWN_INFO
    ? travelPoints.map((point) => point.destination.destinationName).join(' &mdash; ')
    : `${travelPoints[0].destination.destinationName}  &mdash; ... &mdash; ${travelPoints[travelPoints.length-1].destination.destinationName}`}
      </h1>
      <p class="trip-info__dates">${getTimeMMDD(travelPoints[0].dateFrom)}&nbsp;&mdash;&nbsp;${getTimeMMDD(travelPoints[travelPoints.length-1].dateTo)}</p>
    </div>
    <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>
  </section>`;
};

export default class UpTripInfoView extends Abstract {
  #travelPoints = null;

  constructor(travelPoints) {
    super();
    this.#travelPoints = travelPoints;
  }

  get template() {
    return createTripInfoTemplate(this.#travelPoints);
  }
}
