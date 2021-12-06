import { NOTHING } from '../../const';
import { createElement } from '../../render';
import { createFormDestinationTemplate, createHeaderFormTemplate, createSectionOfferTemplate } from './form-template-frame';

const createFormEditingTemplate = (oneTravelPoint) => {
  const {destination, offers} = oneTravelPoint;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">

      ${createHeaderFormTemplate(oneTravelPoint)}

      <section class="event__details">

      ${offers.length === NOTHING ? '' : createSectionOfferTemplate(oneTravelPoint)}

      ${destination ? createFormDestinationTemplate(oneTravelPoint) : ''}

      </section>
    </form>
</li>`;
};

export default class FormEditView {
  #element = null;
  #oneTravelPoint = null;

  constructor(oneTravelPoint) {
    this.#oneTravelPoint = oneTravelPoint;
  }

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFormEditingTemplate(this.#oneTravelPoint);
  }

  removeElement() {
    this.#element = null;
  }
}
