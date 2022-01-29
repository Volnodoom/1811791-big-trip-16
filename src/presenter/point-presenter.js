import { ListOfEventsOn, Mode, RenderPosition, State, UpdateType, UserAction } from '../const';
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
  #listOfOptions = null;
  #mode = Mode.DEFAULT;

  #closeAddNewPointForm = null;

  constructor(container, updateData, changeMode, listOfOptions) {
    this.#pointContainer = container;
    this.#updateData = updateData;
    this.#changeMode = changeMode;
    this.#listOfOptions = listOfOptions;
  }

  init = (point) => {
    this.#oneTravelPoint = point;

    const prevSinglePointComponent = this.#singlePointComponent;
    const prevPointFormEditComponent = this.#pointFormEditComponent;

    this.#singlePointComponent = new SinglePointView(point);
    this.#pointFormEditComponent = new FormEditView(point, this.#listOfOptions);

    this.#setHandlersOnSinglePoint();

    if (prevPointFormEditComponent === null || prevSinglePointComponent === null) {
      render(this.#pointContainer, this.#singlePointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if(this.#mode === Mode.DEFAULT) {
      replace(this.#singlePointComponent, prevSinglePointComponent);
    }

    if(this.#mode === Mode.EDITING) {
      replace(this.#singlePointComponent, prevPointFormEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointFormEditComponent);
  }

  #setHandlersOnSinglePoint = () => {
    this.#singlePointComponent.setClickHandler(ListOfEventsOn.FAVORITE_BTN, this.#handleFavoriteClick);
    this.#singlePointComponent.setClickHandler(ListOfEventsOn.ROLLUP_BTN, () => {
      this.#closeAddNewPointForm();
      this.#handleOpenForm();
      this.#setHandlersOnFormEdit();
    });
  }

  #setHandlersOnFormEdit = () => {
    this.#pointFormEditComponent.setEscPressHandler(this.#handleCloseForm);
    this.#pointFormEditComponent.setClickHandler(ListOfEventsOn.CLOSE_ROLLUP_BTN, this.#handleCloseForm);
    this.#pointFormEditComponent.setSubmitHandler(this.#handleSubmitForm);
    this.#pointFormEditComponent.setDeleteClickHandler(this.#handleDeleteClick);
  }

  #handleCloseForm = () => {
    replace(this.#singlePointComponent, this.#pointFormEditComponent);
    remove(this.#pointFormEditComponent);
    this.#pointFormEditComponent.reset(this.#oneTravelPoint);
    this.#mode = Mode.DEFAULT;
  };

  #handleOpenForm = () => {
    replace(this.#pointFormEditComponent, this.#singlePointComponent);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #handleSubmitForm = (pointUpdate) => {
    this.#updateData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      pointUpdate,
    );
  }

  #handleDeleteClick = (point) => {
    this.#updateData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  #handleFavoriteClick = () => {
    this.#updateData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {
        ...this.#oneTravelPoint,
        isFavorite: !this.#oneTravelPoint.isFavorite,
      });
  }

  setPolicyOnePointOneForm = (closeAddNewPointForm) => {
    this.#closeAddNewPointForm = closeAddNewPointForm;
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#handleCloseForm();
    }
  }

  setViewState = (state) => {
    if(this.#mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this.#pointFormEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this.#pointFormEditComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this.#pointFormEditComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this.#singlePointComponent.shake(resetFormState);
        this.#pointFormEditComponent.shake(resetFormState);
        break;
    }
  }

  destroy() {
    remove(this.#pointFormEditComponent);
    remove(this.#singlePointComponent);
  }
}
