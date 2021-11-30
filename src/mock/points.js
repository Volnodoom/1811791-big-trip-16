import dayjs from 'dayjs';
import {generateOffers} from './offer';
import {generateDestination} from './destination';
import { getRandomInteger } from '../utils';


const generateType = () => {
  const types = [
    'Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant',
  ];

  const randomIndex = getRandomInteger(0, types.length - 1);

  return types[randomIndex];
};

const generateDate = () => {
  const maxMinutesGap = 14400;
  const minutesGap = getRandomInteger(-maxMinutesGap, maxMinutesGap);
  const dateFrom = dayjs().add(minutesGap, 'minute');
  const diff = getRandomInteger(20, 50);
  const dateTo = dateFrom.add(diff, 'minute');

  return {
    dateFrom: dateFrom.toDate(),
    dateTo: dateTo.toDate(),
  };
};

const generateBasePrice = () => getRandomInteger(1, 500) * 10;

export const generateEvent = () => {
  const {dateFrom, dateTo} = generateDate();
  const {offers} = generateOffers();
  const travelType = generateType();

  return {
    basePrice: generateBasePrice(),
    dateFrom,
    dateTo,
    destination: generateDestination(),
    id: getRandomInteger(0, 1000000),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers,
    travelType,
  };
};
