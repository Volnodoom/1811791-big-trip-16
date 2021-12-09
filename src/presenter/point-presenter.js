import { ListOfEventsOn, RenderPosition } from '../const';
import { remove, render, replace } from '../render';
import FormEditView from '../view/form/form-edit-view';
import SinglePointView from '../view/main-body/single-point-view';

export default class PointPresenter {
  #pointContainer = null;

  #singlePointComponent = null;
  #pointFormEditComponent = null;

  #oneTravelPoint = null;

  constructor(container) {
    this.#pointContainer = container;
  }

  init = (point) => {
    this.#oneTravelPoint = point;

    this.#singlePointComponent = new SinglePointView(point);
    this.#pointFormEditComponent = new FormEditView(point);

    this.#setHandlersOnSinglePoint();

    render(this.#pointContainer, this.#singlePointComponent, RenderPosition.BEFOREEND);
  }

  #setHandlersOnSinglePoint = () => {
    this.#singlePointComponent.setClickHandler(() => {
      this.#openForm();
      this.#pointFormEditComponent.setEscPressHandler(this.#closeForm);
      this.#pointFormEditComponent.setClickHandler(ListOfEventsOn.ROLLUP_BTN_FORM, this.#closeForm);
      this.#pointFormEditComponent.setSubmitHandler(this.#closeForm);
    }
    );
  }

  #closeForm = () => {
    replace(this.#singlePointComponent, this.#pointFormEditComponent);
    remove(this.#pointFormEditComponent);
  };

  #openForm = () => {
    replace(this.#pointFormEditComponent, this.#singlePointComponent);
  };


}
