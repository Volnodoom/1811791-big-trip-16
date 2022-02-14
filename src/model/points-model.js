import { UpdateType } from '../const';
import AbstractObservable from './abstract-observer';

export default class PointsModel extends AbstractObservable {
  #points = [];
  #listOfDestinations = null;
  #listOfOffers = null;
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get points() {
    return this.#points;
  }

  getListOfDestinations = () => this.#listOfDestinations;

  getListOfOffers = () => this.#listOfOffers;

  init = async () => {
    try {
      const points = await this.#apiService.getPoints();
      this.#points = points.map((point) => this.#adaptToClient(point));
    } catch (err) {
      this.#points = [];
    }

    try {
      const destinations = await this.#apiService.getListOfDestinations();
      this.#listOfDestinations = destinations.map((point) => this.#adaptDestinationsToClient(point));
    } catch (err) {
      this.#listOfDestinations = [];
    }

    try {
      this.#listOfOffers = await this.#apiService.getListOfOffers();
    } catch (err) {
      this.#listOfOffers = [];
    }

    this._notify(UpdateType.INIT);
  }

  updatePoint = async(updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#apiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  addPoint = async(updateType, update) => {
    try {
      const response = await this.#apiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);

      this.#points = [
        newPoint,
        ...this.#points,
      ];

      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Can\'t add new point');
    }

  }

  deletePoint = async(updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#apiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete point');
    }
  }

  #adaptToClient = (point) => {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      destination: {
        ...point.destination,
        destinationName: point.destination.name,
      },
      isFavorite: point['is_favorite'],
      travelType: point.type,
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint.destination.name;
    delete adaptedPoint['is_favorite'];
    delete adaptedPoint.type;

    return adaptedPoint;
  }

  #adaptDestinationsToClient = (destination) => {
    const adaptedPoint = {
      ...destination,
      destinationName: destination.name,
    };

    delete adaptedPoint.name;
    return adaptedPoint;
  }
}
