export default class Store {
  #storeKey = null;
  #storage = null;

  constructor(storeKey, storage) {
    this.#storeKey = storeKey;
    this.#storage = storage;
  }

  get items() {
    try {
      return JSON.parse(this.#storage.getItem(this.#storeKey)) || {};
    } catch(err) {
      return {};
    }
  }

  setItems(items) {
    this.#storage.setItem(
      this.#storeKey,
      JSON.stringify(items),
    );
  }

  setItem(key, value) {
    const store = this.items();

    this.#storage.setItem(
      this.#storeKey,
      JSON.stringify(
        Object.assign({}, store, {
          [key]: value,
        }),
      ),
    );
  }

  removeItem(key) {
    const store = this.items();

    delete store[key];

    this.#storage.setItem(
      this.#storeKey,
      JSON.stringify(store),
    );
  }
}
