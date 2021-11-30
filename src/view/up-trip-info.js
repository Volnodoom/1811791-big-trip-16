export const createTripInfoTemplate = () => {
  const destination = [];
  const timeStartFirstPoint = '';
  const timeEndLastPoint = '';
  const LIMIT_TOWN_INFO = 3;
  const price = '';

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">
    ${destination <= LIMIT_TOWN_INFO
    ? destination.slice().join(' &mdash; ')
    : `${destination[0]}  &mdash ... &mdash ${destination[destination.length-1]}`}
      </h1>
      <p class="trip-info__dates">${timeStartFirstPoint}&nbsp;&mdash;&nbsp;${timeEndLastPoint}</p>
    </div>
    <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
    </p>
  </section>`;
};
