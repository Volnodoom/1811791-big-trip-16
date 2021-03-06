import { BLANK_POINT, ListOfEventsOn, RenderPosition, UpdateType, UserAction } from '../const';
import { remove, render } from '../render';
import FormEditView from '../view/form/form-edit-view';

export default class AddNewPointPresenter {
    #pointContainer = null;
    #pointFormEditComponent = null;

    #updateData = null;
    #isNoPoints = null;

    #listOfOptions = [];
    #isAddNewBtnActive = false;
    #updateAddNewBtnStatus = null;

    #clearBoard = null;
    #renderBoard =null;

    constructor(pointContainer, updateData, updateAddNewBtnStatus) {
      this.#pointContainer = pointContainer;
      this.#updateData = updateData;

      this.#updateAddNewBtnStatus = updateAddNewBtnStatus;
    }

    init = (listOfOptions, isNoPoints) => {
      this.#listOfOptions = listOfOptions;
      this.#isNoPoints = isNoPoints;

      this.#pointFormEditComponent = new FormEditView(BLANK_POINT, this.#listOfOptions, this.#isAddNewBtnActive);

      render(this.#pointContainer, this.#pointFormEditComponent, RenderPosition.AFTERBEGIN);
      this.#setHandlersOnFormEdit();
    }

    setTemplateForAddNewBtnStatus = (isActive) => {
      this.#isAddNewBtnActive = isActive;
    }

    #setHandlersOnFormEdit = () => {
      this.#pointFormEditComponent.setEscPressHandler(this.handleCloseForm);
      this.#pointFormEditComponent.setClickHandler(ListOfEventsOn.CANCEL_BTN_FORM, this.handleCloseForm);
      this.#pointFormEditComponent.setSubmitHandler(this.#handleSubmitForm);
    }

    handleCloseForm = () => {
      if (this.#pointFormEditComponent) {
        remove(this.#pointFormEditComponent);
        this.#updateAddNewBtnStatus(false);

        if (this.#isNoPoints) {
          this.#clearBoard();
          this.#renderBoard();
        }
      }
    };

    handleForRefreshingBoard = (clearBoard, renderBoard) => {
      this.#clearBoard = clearBoard;
      this.#renderBoard = renderBoard;
    }

    setSaving = () => {
      this.#pointFormEditComponent.updateData({
        isDisabled: true,
        isSaving: true,
      });
    }

    setAborting = () => {
      const resetFormState = () => {
        this.#pointFormEditComponent.updateData({
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        });
      };

      this.#pointFormEditComponent.shake(resetFormState);
    }

    destroy() {
      if (this.#pointFormEditComponent === null) {
        return;
      }

      remove(this.#pointFormEditComponent);
      this.#pointFormEditComponent = null;
    }

    #handleSubmitForm = (pointUpdate) => {
      this.#updateData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        pointUpdate,
      );
    }

}
