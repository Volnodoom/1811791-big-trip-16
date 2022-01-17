import Abstract from '../abstract';

const creatNewEventBtnTemplate = (status) => (
  `<button 
    class="trip-main__event-add-btn  btn  btn--big  btn--yellow" 
    type="button"
    ${status ? 'disabled' : ''}
  >New event
  </button>`);

export default class NewEventBtnView extends Abstract {
  #btnStatus = false;

  get template () {
    return creatNewEventBtnTemplate(this.#btnStatus);
  }

  getContainerForBtn = () => document.querySelector('.trip-main');

  setClickHandler = (callback) => {
    this._callback.clickOnNewEventBtn = callback;
    this.element.addEventListener('click', this.#handleClick);
  }

  setBtnStatus = (btnStatus) => {
    this.#btnStatus = btnStatus.state;
  }

  #handleClick = () => {
    this._callback.clickOnNewEventBtn();
  }
}
