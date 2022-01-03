import dayjs from 'dayjs';
import { getRandomInteger } from '../utils';
import { generateDestination } from './destinations';
import { generateOffers } from './offers';
import {nanoid} from 'nanoid';


const generateTypes = () => {
  const types = [
    'Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant',
  ];

  const randomLength = getRandomInteger(0, types.length - 1);

  return types.slice(randomLength);
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

export const generateTravelPoints = () => {
  const {dateFrom, dateTo} = generateDate();
  const travelTypes = generateTypes();
  const offers = generateOffers(travelTypes);

  return {
    basePrice: generateBasePrice(),
    dateFrom,
    dateTo,
    destination: generateDestination(),
    id: nanoid(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers,
    travelType: travelTypes[0],
  };
};
