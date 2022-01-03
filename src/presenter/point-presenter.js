import { ListOfEventsOn, Mode, RenderPosition } from '../const';
import { remove, render, replace } from '../render';
import FormEditView from '../view/form/form-edit-view';
import SinglePointView from '../view/main-body/single-point-view';

export default class PointPresenter {
  #pointContainer = null;
  #updateData = null;
  #changeMode = null;

  #singlePointComponent = null;
  #pointFormEditComponent = null;

  #oneTravelPoint = null;
  #mode = Mode.DEFAULT;

  constructor(container, updateData, changeMode) {
    this.#pointContainer = container;
    this.#updateData = updateData;
    this.#changeMode = changeMode;
  }

  init = (point) => {
    this.#oneTravelPoint = point;

    const prevSinglePointComponent = this.#singlePointComponent;
    const prevPointFormEditComponent = this.#pointFormEditComponent;

    this.#singlePointComponent = new SinglePointView(point);
    this.#pointFormEditComponent = new FormEditView(point);

    this.#setHandlersOnSinglePoint();

    if (prevPointFormEditComponent === null || prevSinglePointComponent === null) {
      render(this.#pointContainer, this.#singlePointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if(this.#mode === Mode.DEFAULT) {
      replace(this.#singlePointComponent, prevSinglePointComponent);
    }

    if(this.#mode === Mode.EDITING) {
      replace(this.#pointFormEditComponent, prevPointFormEditComponent);
    }

    remove(prevPointFormEditComponent);
  }

  #setHandlersOnSinglePoint = () => {
    this.#singlePointComponent.setClickHandler(ListOfEventsOn.FAVORITE_BTN, this.#handleFavoriteClick);
    this.#singlePointComponent.setClickHandler(ListOfEventsOn.ROLLUP_BTN, () => {
      this.#openForm();
      this.#setHandlersOnFormEdit();
    });
  }

  #setHandlersOnFormEdit = () => {
    this.#pointFormEditComponent.setEscPressHandler(this.#closeForm);
    this.#pointFormEditComponent.setClickHandler(ListOfEventsOn.CLOSE_ROLLUP_BTN, this.#closeForm);
    this.#pointFormEditComponent.setSubmitHandler(this.#submitForm);
  }

  #closeForm = () => {
    replace(this.#singlePointComponent, this.#pointFormEditComponent);
    remove(this.#pointFormEditComponent);
    this.#pointFormEditComponent.reset(this.#oneTravelPoint);
    this.#mode = Mode.DEFAULT;
  };

  #submitForm = (update) => {
    this.#updateData(update);
    this.#closeForm();
  }

  #openForm = () => {
    replace(this.#pointFormEditComponent, this.#singlePointComponent);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #handleFavoriteClick = () => {
    this.#updateData({
      ...this.#oneTravelPoint,
      isFavorite: !this.#oneTravelPoint.isFavorite,
    });
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closeForm();
    }
  }

  destroy() {
    remove(this.#pointFormEditComponent);
    remove(this.#singlePointComponent);
  }
}
