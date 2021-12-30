import { ListOfEventsOn, NOTHING } from '../../const';
import { isEsc } from '../../utils';

import Smart from '../smart';
import { createFormDestinationTemplate, createHeaderFormTemplate, createSectionOfferTemplate } from './form-template-frame';

const createFormEditingTemplate = (oneTravelPoint) => {
  const {destination, hasOptions} = oneTravelPoint;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">

      ${createHeaderFormTemplate(oneTravelPoint)}

      <section class="event__details">

      ${hasOptions ? createSectionOfferTemplate(oneTravelPoint) : ''}

      ${destination ? createFormDestinationTemplate(oneTravelPoint) : ''}

      </section>
    </form>
</li>`;
};

export default class FormEditView extends Smart {
  constructor(oneTravelPoint) {
    super();
    this._data = FormEditView.parsePointInformationToData(oneTravelPoint);

    this.#setInnerClickHandler();
  }

  get template() {
    return createFormEditingTemplate(this._data);
  }

  setClickHandler = (type, callback = null) =>  {
    switch (type) {
      case ListOfEventsOn.CLOSE_ROLLUP_BTN:
        this._callback.clickOnRollUpBtnForm = callback;
        break;
      default:
        throw new Error('ClickHandler does not contain such TYPE of callback');
    }

    this.element.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    switch (true) {
      case (evt.target.dataset.closeRollupForm === ListOfEventsOn.CLOSE_ROLLUP_BTN):
        this._callback.clickOnRollUpBtnForm();
        document.removeEventListener('keydown', this.#escPressHandler);
        break;
    }
  }

  #setInnerClickHandler = () => {
    this.element.addEventListener('click', this.#innerClickHandler);
  }

  #innerClickHandler = (evt) => {
    switch (true) {
      case (evt.target.dataset.eventType === ListOfEventsOn.EVENT_TYPE):
        this.updateData({travelType: evt.target.textContent});
        break;
      case (evt.target.dataset.destinationPoint === ListOfEventsOn.DESTINATION_POINT):
        console.log('You have pressed Destination type CHANGE button');
        break;
    }
  }

  setEscPressHandler = (callback) => {
    this._callback.pressEscape = callback;
    document.addEventListener('keydown', this.#escPressHandler);
  }

  #escPressHandler = (evt) => {
    if (isEsc(evt)) {
      evt.preventDefault();
      this._callback.pressEscape();
      document.removeEventListener('keydown', this.#escPressHandler);
    }
  }

  setSubmitHandler = (callback) => {
    this._callback.submitClick = callback;
    this.element.querySelector('form').addEventListener('submit', this.#submitHandler);
  }

  #submitHandler = (evt) => {
    evt.preventDefault();
    this._callback.submitClick(FormEditView.parseDataToPointInfo(this._data));
    document.removeEventListener('keydown', this.#escPressHandler);
  }

  restoreHandlers = () => {
    this.element.addEventListener('click', this.#clickHandler);
    this.#setInnerClickHandler();
    this.element.querySelector('form').addEventListener('submit', this.#submitHandler);
  }

  reset = (point) => {
    this.updateData(
      FormEditView.parsePointInformationToData(point),
    );
  }

  static parsePointInformationToData = (pointInfo) => ({
    ...pointInfo,
    hasOptions: pointInfo.offers.length !== NOTHING ?? false,
  })

  static parseDataToPointInfo = (data) => {
    const point = {...data};

    delete point.hasOptions;

    return point;
  }
}
