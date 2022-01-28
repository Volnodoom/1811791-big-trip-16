import { BLANK_POINT, ListOfEventsOn, NOTHING } from '../../const';
import { isEsc } from '../../utils';
import Smart from '../smart';
import { createFormDestinationTemplate, createHeaderFormTemplate, createSectionOfferTemplate } from './form-template-frame';
import flatpickr from 'flatpickr';

import '../../../node_modules/flatpickr/dist/flatpickr.min.css';

const createFormEditingTemplate = (oneTravelPoint, destinationList, isAddNewBtnActive) => {
  const {destination, hasOptions} = oneTravelPoint;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">

      ${createHeaderFormTemplate(oneTravelPoint, destinationList, isAddNewBtnActive)}

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
  #isAddNewBtnActive = null;

  constructor(oneTravelPoint, destinationList, isAddNewBtnActive = false) {
    super();
    if (oneTravelPoint === false) {
      this._data = BLANK_POINT;
    } else {
      this._data = FormEditView.parsePointInformationToData(oneTravelPoint);
    }

    this.#destinationList = destinationList;
    this.#isAddNewBtnActive = isAddNewBtnActive;

    this.#setInnerClickHandler();
    this.#setInnerChangeHandler();
    this.#setDatepicker();
  }

  get template() {
    return createFormEditingTemplate(this._data, this.#destinationList, this.#isAddNewBtnActive);
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

  #findInputDestinationElement = () => this.element.querySelector('.event__input.event__input--destination');
  #findInputPriceElement = () => this.element.querySelector('.event__input.event__input--price');

  #clickHandler = (evt) => {
    if (evt.target.dataset.closeRollupForm === ListOfEventsOn.CLOSE_ROLLUP_BTN) {
      this._callback.clickOnRollUpBtnForm();
      document.removeEventListener('keydown', this.#escPressHandler);
    } else if (evt.target.textContent === ListOfEventsOn.CANCEL_BTN_FORM) {
      this._callback.clickOnCancelBtn();
      document.removeEventListener('keydown', this.#escPressHandler);
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
    this.#findInputDestinationElement().addEventListener('change', this.#innerDestinationHandler);
    this.#findInputPriceElement().addEventListener('change', this.#innerPriceHandler);
  }

  #innerPriceHandler = () => {
    const hasNotOnlyDigits = /\D/.test(this.#findInputPriceElement().value);
    if (hasNotOnlyDigits) {
      this.#findInputPriceElement().setCustomValidity('Price should be in numbers. Please, correct your input');
    } else {
      this.#findInputPriceElement().setCustomValidity('');
      this._data = {
        ...this._data,
        basePrice: this.#findInputPriceElement().value,
      };
    }

    this.#findInputPriceElement().reportValidity();
  }

  #innerDestinationHandler = (evt) => {

    const inputValue = evt.target.value;
    const hasCity = this.#destinationList.some((onePoint) => onePoint.destination.destinationName === inputValue);

    if (inputValue.length === NOTHING) {
      evt.target.setCustomValidity('Please select a city from the list or text it. Register is case sensitive');
    } else if (!hasCity) {
      evt.target.setCustomValidity('This city does not exist in our list. Please select another city from the list or text it. Register is case sensitive');
    } else {

      evt.target.setCustomValidity('');
      this.updateData(
        {
          ...this._data,
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
    }
    document.removeEventListener('keydown', this.#escPressHandler);

    evt.target.reportValidity();
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

    if(this.#findInputDestinationElement().value.length === NOTHING) {
      this.#findInputDestinationElement().setCustomValidity('Please select a city from the list or text it. Register is case sensitive');
    } else {
      this._callback.submitClick(FormEditView.parseDataToPointInfo(this._data));
      document.removeEventListener('keydown', this.#escPressHandler);
    }
    this.#findInputDestinationElement().reportValidity();
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
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  })

  static parseDataToPointInfo = (data) => {
    const point = {...data};

    delete point.hasOptions;
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;


    if (point.isBlankPoint) {
      delete point.isBlankPoint;
    }

    return point;
  }
}
