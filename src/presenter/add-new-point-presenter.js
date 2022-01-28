import { ListOfEventsOn, RenderPosition, UpdateType, UserAction } from '../const';
import { remove, render } from '../render';
import FormEditView from '../view/form/form-edit-view';

export default class AddNewPointPresenter {
    #pointContainer = null;
    #updateData = null;

    #pointFormEditComponent = null;

    #destinationList = [];
    #isAddNewBtnActive = false;
    #updateAddNewBtnStatus = null;

    #clearBoard = null;
    #renderBoard =null;

    constructor(pointContainer, updateData, destinationList, updateAddNewBtnStatus) {
      this.#pointContainer = pointContainer;
      this.#updateData = updateData;
      this.#destinationList = destinationList;
      this.#updateAddNewBtnStatus = updateAddNewBtnStatus;
    }

    init = () => {
      this.#pointFormEditComponent = new FormEditView(false, this.#destinationList, this.#isAddNewBtnActive);


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
      remove(this.#pointFormEditComponent);
      this.#updateAddNewBtnStatus(false);
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

    #handleSubmitForm = (pointUpdate) => {
      this.#updateData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        pointUpdate,
      );
    }

    destroy() {
      if (this.#pointFormEditComponent === null) {
        return;
      }

      remove(this.#pointFormEditComponent);
      this.#pointFormEditComponent = null;
    }

}
