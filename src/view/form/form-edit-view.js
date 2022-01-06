import { ListOfEventsOn, NOTHING } from '../../const';
import { isEsc } from '../../utils';
import Smart from '../smart';
import { createFormDestinationTemplate, createHeaderFormTemplate, createSectionOfferTemplate } from './form-template-frame';
import flatpickr from 'flatpickr';

import '../../../node_modules/flatpickr/dist/flatpickr.min.css';

const createFormEditingTemplate = (oneTravelPoint, destinationList) => {
  const {destination, hasOptions} = oneTravelPoint;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">

      ${createHeaderFormTemplate(oneTravelPoint, destinationList)}

      <section class="event__details">

      ${hasOptions ? createSectionOfferTemplate(oneTravelPoint) : ''}

      ${destination ? createFormDestinationTemplate(oneTravelPoint) : ''}

      </section>
    </form>
</li>`;
};

export default class FormEditView extends Smart {
  #datapickerStart = null;
  #datapickerEnd = null;
  #destinationList = [];

  constructor(oneTravelPoint, destinationList) {
    super();
    this._data = FormEditView.parsePointInformationToData(oneTravelPoint);

    this.#destinationList = destinationList;

    this.#setInnerClickHandler();
    this.#setInnerChangeHandler();
    this.#setDatepicker();
  }

  get template() {
    return createFormEditingTemplate(this._data, this.#destinationList);
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

    if (inputValue.length === NOTHING) {
      evt.target.setCustomValidity('Please select a city from the list or text it. Register is case sensitive');
    } else if (!hasCity) {
      evt.target.setCustomValidity('This city does not exist in our list. Please select another city from the list or text it. Register is case sensitive');
    } else {
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
        },
      );
    }
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
    this._callback.submitClick(FormEditView.parseDataToPointInfo(this._data));
    document.removeEventListener('keydown', this.#escPressHandler);
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

    return point;
  }
}
