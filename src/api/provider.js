import { isOnline } from '../utils';

export default class Provider {
  #api = null;
  #store = null;

  constructor(api, store) {
    this.#api = api;
    this.#store = store;
  }

  getPoints = async () => {
    if (isOnline()) {
      const points = await this.#api.getPoints();
      const items = Provider.createStoreStructure(points);
      this.#store.setItems(items);

      return points;
    }

    const storePoints = Object.values(this.#store.items);
    return Promise.resolve(storePoints);
  }

  getListOfDestinations = async () => {
    if (isOnline()) {
      return this.#api.getListOfDestinations();
    }

    return Promise.reject(new Error ('Get destinations failed'));
  }

  getListOfOffers = async () => {
    if (isOnline()) {
      return this.#api.getListOfOffers();
    }

    return Promise.reject(new Error ('Get offers failed'));
  }

  updatePoint = async(point) => {
    if (isOnline()) {
      const updatedPoint = await this.#api.updatePoint(point);
      this.#store.setItem(updatedPoint.id, updatedPoint);

      return updatedPoint;
    }

    this.#store.setItem(point.id, point);
    return Promise.resolve(point);
  }

  addPoint = async(point) => {
    if (isOnline()) {
      const addedPoint = await this.#api.addPoint(point);
      this.#store.setItem(addedPoint.id, addedPoint);

      return addedPoint;
    }

    return Promise.reject(new Error ('Add new point failed'));
  }

  deletePoint = async(point) => {
    if (isOnline()) {
      const deletedPoint = await this.#api.deletePoint(point);
      this.#store.removeItem(deletedPoint.id);

      return deletedPoint;
    }

    return Promise.reject(new Error ('Delet point failed'));
  }

  sync = async () => {
    if (isOnline()) {
      const storePoints = Object.values(this.#store.items);
      const syncedPoints = await this.#api.sync(storePoints);
      const createdPoints = Provider.getSyncedPoints(syncedPoints.created);
      const updatedPoints = Provider.getSyncedPoints(syncedPoints.updated);
      const items = Provider.createStoreStructure([...createdPoints, ...updatedPoints]);

      this.#store.setItems(items);
    }

    return Promise.reject(new Error ('Sync data failed'));
  }

  static createStoreStructure = (items) =>
    items
      .reduce((acc, current) => ({
        ...acc,
        [current.id]: current,

      }), {});

  static getSyncedPoints = (items) => items
    .filter(({success}) => success)
    .map(({payload}) => payload.point);
}
