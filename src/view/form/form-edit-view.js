import { BLANK_POINT, ErrorMessage, ListOfEventsOn, NOTHING } from '../../const';
import { correctDateFormatForFlitpicker, isDayEndEarlyDayStart, isDayEndEarlyDayStartFlatpicker, isEsc } from '../../utils';
import Smart from '../smart';
import { createFormDestinationTemplate, createHeaderFormTemplate, createSectionOfferTemplate } from './form-template-frame';
import flatpickr from 'flatpickr';
import he from 'he';

import '../../../node_modules/flatpickr/dist/flatpickr.min.css';

const createFormEditingTemplate = (oneTravelPoint, listOfOptions, isAddNewBtnActive) => {
  const {travelType, destination, } = oneTravelPoint;
  const hasOptions = listOfOptions.offers.find((oneOffer) => oneOffer.type === travelType).offers.length > NOTHING;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">

      ${createHeaderFormTemplate(oneTravelPoint, listOfOptions, isAddNewBtnActive)}

      <section class="event__details">

      ${hasOptions ? createSectionOfferTemplate(oneTravelPoint, listOfOptions) : ''}

      ${destination.description ? createFormDestinationTemplate(oneTravelPoint) : ''}

      </section>
    </form>
</li>`;
};

export default class FormEditView extends Smart {
  #datapickerStart = null;
  #datapickerEnd = null;
  #listOfOptions = null;
  #isAddNewBtnActive = null;

  constructor(oneTravelPoint, listOfOptions, isAddNewBtnActive = false) {
    super();
    if (oneTravelPoint === BLANK_POINT) {
      this._data = BLANK_POINT;
      this._data = {
        ...this._data,
        dateFrom: new Date(this._data.dateFrom).toISOString(),
        dateTo: new Date(this._data.dateTo).toISOString(),
      };
    } else {
      this._data = FormEditView.parsePointInformationToData(oneTravelPoint);
    }

    this.#listOfOptions = listOfOptions;
    this.#isAddNewBtnActive = isAddNewBtnActive;

    this.#setInnerClickHandler();
    this.#setInnerChangeHandler();
    this.#setDatepicker();
  }

  get template() {
    return createFormEditingTemplate(this._data, this.#listOfOptions, this.#isAddNewBtnActive);
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
  #findAllCheckBoxes = () => this.element.querySelectorAll('.event__offer-checkbox.visually-hidden');
  #findInputEndDataElement = () => this.element.querySelector('[name="event-end-time"]');

  #clickHandler = (evt) => {
    if (evt.target.dataset.closeRollupForm === ListOfEventsOn.CLOSE_ROLLUP_BTN) {
      this._callback.clickOnRollUpBtnForm();
      document.removeEventListener('keydown', this.#escPressHandler);
    } else if (evt.target.textContent.trim() === ListOfEventsOn.CANCEL_BTN_FORM) {
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
        this.updateData({
          ...this._data,
          travelType: evt.target.textContent.slice().replace(evt.target.textContent[0], evt.target.textContent[0].toLowerCase()),
          offers: [],
        });
        break;
    }
  }

  #setInnerChangeHandler = () => {
    this.#findInputDestinationElement().addEventListener('change', this.#innerDestinationHandler);
    this.#findInputPriceElement().addEventListener('change', this.#innerPriceHandler);
    Array.from(this.#findAllCheckBoxes()).forEach((checkbox) => checkbox.addEventListener('change', this.#innerCheckBoxHandler));
  }

  #innerPriceHandler = () => {
    const hasNotOnlyDigits = /\D/.test(he.encode(this.#findInputPriceElement().value.trim()));
    if (hasNotOnlyDigits) {
      this.#findInputPriceElement().setCustomValidity(ErrorMessage.PRICE);
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
    const inputValue = he.encode(evt.target.value);
    const hasCity = this.#listOfOptions.destinations.some((onePoint) => onePoint.destinationName === inputValue);

    if (inputValue.length === NOTHING) {
      evt.target.setCustomValidity(ErrorMessage.SELECT_CITY);
    } else if (!hasCity) {
      evt.target.setCustomValidity(ErrorMessage.SELECT_EXISTED_CITY);
    } else {
      evt.target.setCustomValidity('');
      this.updateData(
        {
          ...this._data,
          destination: {
            description: this.#listOfOptions.destinations.find((onePoint) => onePoint.destinationName === inputValue).description,
            destinationName: inputValue,
            pictures: this.#listOfOptions.destinations.find((onePoint) => onePoint.destinationName === inputValue).pictures,
          },
        },
      );
    }
    document.removeEventListener('keydown', this.#escPressHandler);

    evt.target.reportValidity();
  }

  #innerCheckBoxHandler = (evt) => {
    const checkboxElement = evt.target;
    const selectedOfferId = /\d{1,}/.exec(checkboxElement.id)[0];

    if (!checkboxElement.checked) {
      const index = this._data.offers.findIndex((offer) => Number(offer.id) === Number(selectedOfferId));

      this.updateData({
        ...this._data,
        offers:[
          ...this._data.offers.slice(0, index),
          ...this._data.offers.slice(index + 1),
        ]
      });
    } else {
      const offerForCurrentType = this.#listOfOptions.offers.find((offer) => offer.type === this._data.travelType);
      const addedOffer = offerForCurrentType.offers.find((offer) => Number(offer.id) === Number(selectedOfferId));

      this.updateData({
        ...this._data,
        offers:[
          addedOffer,
          ...this._data.offers,
        ]
      });
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
    const hasNotOnlyDigits = /\D/.test(this.#findInputPriceElement().value.trim());

    if(this.#findInputDestinationElement().value.length === NOTHING) {
      this.#findInputDestinationElement().setCustomValidity(ErrorMessage.SELECT_CITY);
    } else if (hasNotOnlyDigits || (this.#findInputPriceElement().value === '')) {
      this.#findInputPriceElement().setCustomValidity(ErrorMessage.PRICE);
    } else if (isDayEndEarlyDayStart(this._data.dateFrom, this._data.dateTo)) {
      window.alert(ErrorMessage.DATE_END_EVENT);
    } else {
      this._callback.submitClick(FormEditView.parseDataToPointInfo(this._data));
      document.removeEventListener('keydown', this.#escPressHandler);
    }
    this.#findInputDestinationElement().reportValidity();
    this.#findInputPriceElement().reportValidity();
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
        dateFormat: 'd/m/Y H:i',
        'time_24hr': true,
        defaultDate: correctDateFormatForFlitpicker(this._data.dateFrom),
        onChange: this.#startDateChangeHandler,
      },
    );

    this.#datapickerEnd = flatpickr(
      this.#findInputEndDataElement(),
      {
        enableTime: true,
        dateFormat: 'd/m/Y H:i',
        'time_24hr': true,
        defaultDate: correctDateFormatForFlitpicker(this._data.dateTo),
        onChange: this.#endDateChangeHandler,
        disable: [
          (date) => (isDayEndEarlyDayStartFlatpicker(this._data.dateFrom, date))
        ],
      },
    );
  }

  #startDateChangeHandler = ([userDate]) => {
    this.updateData({
      ...this._data,
      dateFrom: userDate,
    });
  }

  #endDateChangeHandler = ([userDate]) => {
    this.updateData({
      ...this._data,
      dateTo: userDate,
    });
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
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  })

  static parseDataToPointInfo = (data) => {
    const point = {...data};

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
