export const createSectionOfferTemplate = (oneTravelPoint) => {
  const {offers} = oneTravelPoint;
  const result = [];

  const singleOfferButton = (oneOffer) => {
    const {title, price, id} = oneOffer;

    return `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${id}"  type="checkbox" name="event-offer-luggage"  checked>

    <label class="event__offer-label" for="event-offer-luggage-1">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>`;
  };

  offers.slice().forEach((oneOffer) => result.push(singleOfferButton(oneOffer)));

  return `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>

  <div class="event__available-offers">
    ${result.join(' ')}
  </div>
</section>`;
};
