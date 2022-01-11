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
  },
  BUS: {
    lowCaseWord: 'bus',
    capitalLetterWord: 'Bus',
  },
  TRAIN: {
    lowCaseWord: 'train',
    capitalLetterWord: 'Train',
  },
  SHIP: {
    lowCaseWord: 'ship',
    capitalLetterWord: 'Ship',
  },
  DRIVE: {
    lowCaseWord: 'drive',
    capitalLetterWord: 'Drive',
  },
  FLIGHT: {
    lowCaseWord: 'flight',
    capitalLetterWord: 'Flight',
  },
  CHECK_IN: {
    lowCaseWord: 'check-in',
    capitalLetterWord: 'Check-in',
  },
  SIGHTSEEING: {
    lowCaseWord: 'sightseeing',
    capitalLetterWord: 'Sightseeing',
  },
  RESTAURANT: {
    lowCaseWord: 'restaurant',
    capitalLetterWord: 'Restaurant',
  }
};

export const ListOfEventsOn = {
  CLOSE_ROLLUP_BTN: 'rollup-btn-form',
  ROLLUP_BTN: 'event__rollup-btn',
  FAVORITE_BTN: 'event__favorite-btn',
  EVENT_TYPE: 'event__type  event__type-btn',
  DESTINATION_POINT: 'event__field-group  event__field-group--destination',
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
};

export const BLANK_POINT = {
  basePrice: '0',
  dateFrom: '01/01/01',
  dateTo: '01/01/01',
  destination: {
    description: generateDestinationDescription(),
    destinationName: generateName(),
    pictures: new Array(picturesCount).fill().map(generatePicture),
  },
  offers: [
    {
      type,
      offers
    }
  ],
  travelType: 'Taxi',
};

export const NOTHING = 0;
export const ARRAY_WITH_EMPTY_OBJECT = 1;
export const LIMIT_TOWN_INFO = 3;
export const TRAVEL_POINT_COUNT = 15;
export const ONE_HOUR = 60;
export const TWENTY_FOUR_HOURS = 1440;

export const CHECK_IN = 'CHECK-IN';
export const CHECK_IN_SPECIFIC = 'CHECK_IN';
