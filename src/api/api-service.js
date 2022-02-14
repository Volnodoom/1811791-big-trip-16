import { Method } from '../const';

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  getPoints = () =>
    this.#load({url: '/points'})
      .then(ApiService.parseResponse);

  getListOfDestinations = () => this.#load({url: '/destinations'})
    .then(ApiService.parseResponse)

  getListOfOffers = () => this.#load({url: '/offers'})
    .then(ApiService.parseResponse)

  updatePoint = async(point) => {
    const response = await this.#load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  addPoint = async(point) => {
    const response = await this.#load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  deletePoint = async(point) => {
    const response = await this.#load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  sync = async(data) => {
    const response = await this.#load({
      url: 'points/sync',
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #load = async({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try{
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  static adaptToServer = (point) => {
    const adaptedPoint = {
      ...point,
      'base_price': Number(point.basePrice),
      'date_from':  point.dateFrom,
      'date_to':  point.dateTo,
      destination: {
        ...point.destination,
        name: point.destination.destinationName,
      },
      'is_favorite':  point.isFavorite,
      type:  point.travelType,
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.destination.destinationName;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.travelType;

    return adaptedPoint;
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if(!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw new Error (`Something went wrong with data ${err}`);
  }
}
