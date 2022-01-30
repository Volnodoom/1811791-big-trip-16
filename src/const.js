export const TimeFormat = {
  YEAR_FORMAT: 'YYYY',
  YEAR_FORMAT_SHORT: 'YY',
  MONTH_NUMBER_FORMAT: 'MM',
  MONTH_WORDS_FORMAT: 'MMM',
  DAY_FORMAT: 'DD',
  HOURS_FORMAT: 'HH',
  MINUTES_FORMAT:'mm',
  MINUTES_FOR_DIFFERENCE: 'm',
};

export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

export const FilterLabelStartFrame  = {
  EVERYTHING: {
    filter: 'everything',
    lowCaseWord: 'everything',
    capitalLetterWord: 'Everything',
  },
  FUTURE: {
    filter: 'future',
    lowCaseWord: 'future',
    capitalLetterWord: 'Future',
  },
  PAST: {
    filter: 'past',
    lowCaseWord: 'past',
    capitalLetterWord: 'Past',
  }
};

export const SortingLabelStartFrame = {
  DAY: {
    lowCaseWord: 'day',
    capitalLetterWord: 'Day',
  },
  EVENT: {
    lowCaseWord: 'event',
    capitalLetterWord: 'Event',
    isDisabled: true,
  },
  TIME: {
    lowCaseWord: 'time',
    capitalLetterWord: 'Time',
  },
  PRICE: {
    lowCaseWord: 'price',
    capitalLetterWord: 'Price',
  },
  OFFERS: {
    lowCaseWord: 'offer',
    capitalLetterWord: 'Offers',
    isDisabled: true,
  }
};

export const EventDescription = {
  TAXI: {
    lowCaseWord: 'taxi',
    capitalLetterWord: 'Taxi',
    statisticsLabele: 'TAXI',
  },
  BUS: {
    lowCaseWord: 'bus',
    capitalLetterWord: 'Bus',
    statisticsLabele: 'BUS',
  },
  TRAIN: {
    lowCaseWord: 'train',
    capitalLetterWord: 'Train',
    statisticsLabele: 'TRAIN',
  },
  SHIP: {
    lowCaseWord: 'ship',
    capitalLetterWord: 'Ship',
    statisticsLabele: 'SHIP',
  },
  DRIVE: {
    lowCaseWord: 'drive',
    capitalLetterWord: 'Drive',
    statisticsLabele: 'DRIVE',
  },
  FLIGHT: {
    lowCaseWord: 'flight',
    capitalLetterWord: 'Flight',
    statisticsLabele: 'FLIGHT',
  },
  CHECK_IN: {
    lowCaseWord: 'check-in',
    capitalLetterWord: 'Check-in',
    statisticsLabele: 'CHECK-IN',
  },
  SIGHTSEEING: {
    lowCaseWord: 'sightseeing',
    capitalLetterWord: 'Sightseeing',
    statisticsLabele: 'SIGHTSEEING',
  },
  RESTAURANT: {
    lowCaseWord: 'restaurant',
    capitalLetterWord: 'Restaurant',
    statisticsLabele: 'RESTAURANT',
  }
};

export const ListOfEventsOn = {
  CLOSE_ROLLUP_BTN: 'rollup-btn-form',
  ROLLUP_BTN: 'event__rollup-btn',
  FAVORITE_BTN: 'event__favorite-btn',
  EVENT_TYPE: 'event__type  event__type-btn',
  DESTINATION_POINT: 'event__field-group  event__field-group--destination',
  CANCEL_BTN_FORM: 'Cancel',
  OFFER_BTN: 'OFFER BTN',
};

export const EmptyMessageStatement = {
  [FilterLabelStartFrame.EVERYTHING.filter]: 'Click New Event to create your first point',
  [FilterLabelStartFrame.PAST.filter]: 'There are no past events now',
  [FilterLabelStartFrame.FUTURE.filter]: 'There are no future events now',
};

export const KeyCode = {
  ESCAPE: 'Escape',
};

export const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const BLANK_POINT = {
  basePrice: '',
  dateFrom: '01/01/22',
  dateTo: '01/01/22',
  destination: {
    description: '',
    destinationName: '',
    pictures: [],
  },
  offers: [],
  isFavorite: false,
  travelType: 'taxi',
};

export const MenuItem = {
  TABLE: 'Table',
  STATS: 'Stats',
};

export const ChartNames = {
  MONEY: 'MONEY',
  TYPE: 'TYPE',
  TIME: 'TIME',
};

export const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export const ErrorMessage = {
  PRICE: 'Price should be in numbers. Please, correct your input',
  SELECT_CITY: 'Please select a city from the list or text it. Register is case sensitive',
  SELECT_EXISTED_CITY: 'This city does not exist in our list. Please select another city from the list or text it. Register is case sensitive',
  DATE_END_EVENT: 'Date of the event end could not be earlier then the date of the event\'s start. Please, correct the date of the end event',
};

export const NOTHING = 0;
export const ARRAY_WITH_EMPTY_OBJECT = 1;
export const LIMIT_TOWN_INFO = 3;
export const ONE_HOUR = 60;
export const TWENTY_FOUR_HOURS = 1440;
export const ONE_DAY = 1;
export const DAY_FORMAT = 'day';
export const STATISTICS_BAR_HEIGHT = 450;
export const SHAKE_ANIMATION_TIMEOUT = 600;
export const SHAKE_DURATION = 0.6;

export const AUTHORIZATION  = 'Basic hS2suktyik563bdl1sa2j';
export const END_POINT = 'https://16.ecmascript.pages.academy/big-trip';

