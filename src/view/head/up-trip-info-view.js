import { LIMIT_TOWN_INFO, NOTHING } from '../../const';
import { createElement } from '../../render';
import { getTimeMMDD } from '../../utils';

const createTripInfoTemplate = (travelPoints) => {

  const totalPriceWithoutAdditionalOffersPrice = travelPoints
    .reduce((accumulator, {basePrice}) => accumulator + basePrice, NOTHING);

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
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPriceWithoutAdditionalOffersPrice}</span>
    </p>
  </section>`;
};

export default class UpTripInfoView {
  #element = null;
  #travelPoints = null;

  constructor(travelPoints) {
    this.#travelPoints = travelPoints;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createTripInfoTemplate(this.#travelPoints);
  }

  removeElement() {
    this.#element = null;
  }
}
