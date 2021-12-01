import { createHeaderFormTemplate } from './header-form';
import { createFormDestinationTemplate } from './section-destination';
import { createSectionOfferTemplate } from './section-offer';

export const createFormEditingTemplate = (oneTravelPoint) => {
  const {destination, offers} = oneTravelPoint;

  return ` <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">

      ${createHeaderFormTemplate(oneTravelPoint)}

      <section class="event__details">

      ${offers ? createSectionOfferTemplate(oneTravelPoint) : ''}

      ${destination ? createFormDestinationTemplate(oneTravelPoint) : ''}

      </section>
    </form>
</li>`;
};
