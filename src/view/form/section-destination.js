export const createFormDestinationTemplate = (oneTravelPoint) => {
  const {description, pictures} = oneTravelPoint.destination;
  const result = [];

  pictures
    .slice()
    .forEach((picture) => result.push(`<img class="event__photo" src="${picture.src}" alt="${picture.description}">`));

  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${result.join(' ')}
      </div>
    </div>
  </section>`;
};
