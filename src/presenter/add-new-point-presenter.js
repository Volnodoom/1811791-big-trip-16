import { ListOfEventsOn, RenderPosition, UpdateType, UserAction } from '../const';
import { remove, render } from '../render';
import FormEditView from '../view/form/form-edit-view';

export default class AddNewPointPresenter {
    #pointContainer = null;
    #updateData = null;

    #pointFormEditComponent = null;

    #destinationList = [];
    _AddNewBtnState = {isAddNewBtn: false, state: false};

    constructor(pointContainer, updateData, destinationList) {
      this.#pointContainer = pointContainer;
      this.#updateData = updateData;
      this.#destinationList = destinationList;
    }

    init = () => {
      this.#pointFormEditComponent = new FormEditView(false, this.#destinationList, this._AddNewBtnState);


      render(this.#pointContainer, this.#pointFormEditComponent, RenderPosition.AFTERBEGIN);
      this.#setHandlersOnFormEdit();
    }


    #setHandlersOnFormEdit = () => {
      this.#pointFormEditComponent.setEscPressHandler(this.#handleCloseForm);
      this.#pointFormEditComponent.setClickHandler(ListOfEventsOn.CANCEL_BTN_FORM, this.#handleCloseForm);
      this.#pointFormEditComponent.setSubmitHandler(this.#handleSubmitForm);
    }

    #handleCloseForm = () => {
      remove(this.#pointFormEditComponent);
      this.#toggleAddNewBtnStatus();
    };


    #handleSubmitForm = (pointUpdate) => {
      this.#updateData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        pointUpdate,
      );
      this.#handleCloseForm();
    }

    setAddNewBtnStatus = (currentState) => {
      this._AddNewBtnState = currentState;
    }

    getAddNewBtnStatus = () => this._AddNewBtnState

    #toggleAddNewBtnStatus = () => {
      this._AddNewBtnState = {
        isAddNewBtn: !this._AddNewBtnState.isAddNewBtn,
        state: !this._AddNewBtnState.state,
      };
    }


    destroy() {
      if (this.#pointFormEditComponent === null) {
        return;
      }

      remove(this.#pointFormEditComponent);
      this.#pointFormEditComponent = null;
    }

}
