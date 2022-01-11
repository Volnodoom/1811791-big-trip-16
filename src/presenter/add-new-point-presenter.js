
export default class AddNewPointPresenter {
    #pointContainer = null;
    #updateData = null;

    #pointFormEditComponent = null;

    #destinationList = [];

    constructor(container, updateData, destinationList) {
      this.#pointContainer = container;
      this.#updateData = updateData;
      this.#destinationList = destinationList;
    }

    init = () => {
      this.#pointFormEditComponent = new FormEditView(point, this.#destinationList);

        render(this.#pointContainer, this.#pointFormEditComponent, RenderPosition.BEFOREEND);

    }


    #setHandlersOnFormEdit = () => {
      this.#pointFormEditComponent.setEscPressHandler(this.#closeForm);
      this.#pointFormEditComponent.setClickHandler(ListOfEventsOn.CLOSE_ROLLUP_BTN, this.#closeForm);
      this.#pointFormEditComponent.setSubmitHandler(this.#submitForm);
      this.#pointFormEditComponent.setDeleteClickHandler(this.#handleDeleteClick);
    }

    #closeForm = () => {
      remove(this.#pointFormEditComponent);

      this.#mode = Mode.DEFAULT;
    };


    #submitForm = (pointUpdate) => {
      this.#updateData(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        pointUpdate,
      );
      this.#closeForm();
    }

    destroy() {
      remove(this.#pointFormEditComponent);
      remove(this.#singlePointComponent);
    }

}
