import { createSectionOfferTemplate } from '../create/form-offer';
import { createHeaderFormTemplate } from './form-header';

export const createFormEditingTemplate = (oneTravelPoint) => {
  const {description} = oneTravelPoint.destination;

  return ` <form class="event event--edit" action="#" method="post">

  ${createHeaderFormTemplate(oneTravelPoint)}

  <section class="event__details">
    ${createSectionOfferTemplate(oneTravelPoint)}

    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
    </section>
  </section>
</form>`;
};
