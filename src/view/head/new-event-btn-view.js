import Abstract from '../abstract';

const creatNewEventBtnTemplate = () => (
  `<button 
    class="trip-main__event-add-btn  btn  btn--big  btn--yellow" 
    type="button"
  >New event
  </button>`);

export default class NewEventBtnView extends Abstract {

  get template () {
    return creatNewEventBtnTemplate();
  }

  getContainerForBtn = () => document.querySelector('.trip-main');

  setClickHandler = (callback) => {
    this._callback.clickOnNewEventBtn = callback;
    this.element.addEventListener('click', this.#handleClick);
  }

  setBtnDisabledStatus = (isDisabled) => {
    this.element.disabled = isDisabled;
  }

  #handleClick = () => {
    this._callback.clickOnNewEventBtn();
  }
}
