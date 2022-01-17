import { BLANK_POINT, ListOfEventsOn, NOTHING } from '../../const';
import { isEsc } from '../../utils';
import Smart from '../smart';
import { createFormDestinationTemplate, createHeaderFormTemplate, createSectionOfferTemplate } from './form-template-frame';
import flatpickr from 'flatpickr';

import '../../../node_modules/flatpickr/dist/flatpickr.min.css';

const createFormEditingTemplate = (oneTravelPoint, destinationList, addNewBtnState) => {
  const {destination, hasOptions} = oneTravelPoint;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">

      ${createHeaderFormTemplate(oneTravelPoint, destinationList, addNewBtnState)}

      <section class="event__details">

      ${hasOptions ? createSectionOfferTemplate(oneTravelPoint) : ''}

      ${destination.description ? createFormDestinationTemplate(oneTravelPoint) : ''}

      </section>
    </form>
</li>`;
};

export default class FormEditView extends Smart {
  #datapickerStart = null;
  #datapickerEnd = null;
  #destinationList = [];
  #addNewBtnState = null;

  constructor(oneTravelPoint, destinationList, addNewBtnState = false) {
    super();
    if (oneTravelPoint === false) {
      this._data = BLANK_POINT;
    } else {
      this._data = FormEditView.parsePointInformationToData(oneTravelPoint);
    }

    this.#destinationList = destinationList;
    this.#addNewBtnState = addNewBtnState;

    this.#setInnerClickHandler();
    this.#setInnerChangeHandler();
    this.#setDatepicker();
  }

  get template() {
    return createFormEditingTemplate(this._data, this.#destinationList, this.#addNewBtnState);
  }

  setClickHandler = (type, callback = null) =>  {
    switch (type) {
      case ListOfEventsOn.CLOSE_ROLLUP_BTN:
        this._callback.clickOnRollUpBtnForm = callback;
        break;
      case ListOfEventsOn.CANCEL_BTN_FORM:
        this._callback.clickOnCancelBtn = callback;
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
      case (evt.target.textContent === ListOfEventsOn.CANCEL_BTN_FORM):
        this._callback.clickOnCancelBtn();
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
    }
  }

  #setInnerChangeHandler = () => {
    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#innerChangeHandler);
  }

  #innerChangeHandler = (evt) => {

    const inputValue = evt.target.value;
    const hasCity = this.#destinationList.some((onePoint) => onePoint.destination.destinationName === inputValue);

    const inputPriceElement = this.element.querySelector('.event__input.event__input--price');
    const hasDifferentSimbols = /\D/.test(inputPriceElement.value);

    switch (true) {
      case (inputValue.length === NOTHING):
        evt.target.setCustomValidity('Please select a city from the list or text it. Register is case sensitive');
        break;
      case !hasCity:
        evt.target.setCustomValidity('This city does not exist in our list. Please select another city from the list or text it. Register is case sensitive');
        break;
      case hasDifferentSimbols:
        inputPriceElement.setCustomValidity('Price should be in numbers. Please, correct your input');
        break;
      default:
        inputPriceElement.setCustomValidity('');
        evt.target.setCustomValidity('');
        this.updateData(
          {
            destination: {
              description: this.#destinationList.find((onePoint) => onePoint.destination.destinationName === inputValue).destination.description,
              destinationName: inputValue,
              pictures: this.#destinationList.find((onePoint) => onePoint.destination.destinationName === inputValue).destination.pictures,
            },
            offers: this.#destinationList.find((onePoint) => onePoint.destination.destinationName === inputValue).offers,
            travelType: this.#destinationList.find((onePoint) => onePoint.destination.destinationName === inputValue).travelType,
            basePrice: this.#destinationList.find((onePoint) => onePoint.destination.destinationName === inputValue).basePrice,
            hasOptions: this.#destinationList.find((onePoint) => onePoint.destination.destinationName === inputValue).offers.length !== NOTHING ?? false,
          },
        );

        document.removeEventListener('keydown', this.#escPressHandler);
    }

    evt.target.reportValidity();
    inputPriceElement.reportValidity();
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

    const hasCity = this.#destinationList.some((onePoint) => onePoint.destination.destinationName === this._data.destination.destinationName);
    const inputElement = this.element.querySelector('.event__input.event__input--destination');

    const inputPriceElement = this.element.querySelector('.event__input.event__input--price');
    const hasDifferentSimbols = /\D/.test(inputPriceElement.value);

    switch (true) {
      case (this._data.destination.destinationName.length === NOTHING || null):
        inputElement.setCustomValidity('Please select a city from the list or text it. Register is case sensitive');
        break;
      case !hasCity:
        inputElement.setCustomValidity('This city does not exist in our list. Please select another city from the list or text it. Register is case sensitive');
        document.removeEventListener('keydown', this.#escPressHandler);
        break;
      case hasDifferentSimbols:
        inputPriceElement.setCustomValidity('Price should be in numbers. Please, correct your input');
        break;
      default:
        inputElement.setCustomValidity('');
        this._callback.submitClick(FormEditView.parseDataToPointInfo(this._data));

    }

    inputElement.reportValidity();
    inputPriceElement.reportValidity();
  }

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  }

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(FormEditView.parseDataToPointInfo(this._data));
  }

  #setDatepicker = () => {
    this.#datapickerStart = flatpickr(
      this.element.querySelector('[name="event-start-time"]'),
      {
        enableTime: true,
        dateFormat: 'd/m/Y H:m',
        'time_24hr': true,
        defaultDate: this._data.dateFrom,
        onChange: this.#startDateChangeHandler,
      },
    );

    this.#datapickerEnd = flatpickr(
      this.element.querySelector('[name="event-end-time"]'),
      {
        enableTime: true,
        dateFormat: 'd/m/Y H:m',
        'time_24hr': true,
        defaultDate: this._data.dateTo,
        onChange: this.#endDateChangeHandler,
      },
    );
  }

  #startDateChangeHandler = ([userDate]) => {
    this.updateData({dateFrom: userDate});
  }

  #endDateChangeHandler = ([userDate]) => {
    this.updateData({dateTo: userDate});
  }

  restoreHandlers = () => {
    this.element.addEventListener('click', this.#clickHandler);
    this.#setInnerClickHandler();
    this.element.querySelector('form').addEventListener('submit', this.#submitHandler);
    this.#setDatepicker();
    this.#setInnerChangeHandler();
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  reset = (point) => {
    this.updateData(
      FormEditView.parsePointInformationToData(point),
    );
  }

  removeElement  = () => {
    super.removeElement();

    if (this.#datapickerStart || this.#datapickerEnd) {
      this.#datapickerStart.destroy();
      this.#datapickerStart = null;
      this.#datapickerEnd.destroy();
      this.#datapickerEnd = null;
    }
  }

  static parsePointInformationToData = (pointInfo) => ({
    ...pointInfo,
    hasOptions: pointInfo.offers.length !== NOTHING ?? false,
  })

  static parseDataToPointInfo = (data) => {
    const point = {...data};

    delete point.hasOptions;
    if (point.isBlankPoint) {
      delete point.isBlankPoint;
    }

    return point;
  }
}
