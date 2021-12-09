import { DataAttributesList, ListOfEventsOn, NOTHING } from '../../const';
import { isEsc } from '../../utils';
import Abstract from '../abstract';
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

export default class FormEditView extends Abstract{
  #oneTravelPoint = null;

  constructor(oneTravelPoint) {
    super();
    this.#oneTravelPoint = oneTravelPoint;
  }

  get template() {
    return createFormEditingTemplate(this.#oneTravelPoint);
  }

  setClickHandler = (type, callback) =>  {
    switch (type) {
      case ListOfEventsOn.ROLLUP_BTN_FORM:
        this._callback.clickOnRollUpBtnForm = callback;
        break;
      default:
        throw new Error('ClickHandler does not contain such TYPE of callback');
    }

    this.element.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    switch (evt.target.getAttribute('data-btnClick')) {
      case DataAttributesList.BUTTON_CLICK.rollupBtnForm:
        this._callback.clickOnRollUpBtnForm();
        break;
    }
  }

  setEscPressHandler = (callback) => {
    this._callback.pressEscape = callback;
    this.element.addEventListener('keydown', this.#escPressHandler);
  }

  #escPressHandler = (evt) => {
    if (isEsc(evt)) {
      evt.preventDefault();
      this._callback.pressEscape();
    }
  }

  setSubmitHandler = (callback) => {
    this._callback.submitClick = callback;
    this.element.querySelector('form').addEventListener('submit', this.#submitHandler);
  }

  #submitHandler = (evt) => {
    evt.preventDefault();
    this._callback.submitClick();
  }
}
