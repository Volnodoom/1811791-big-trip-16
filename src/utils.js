import dayjs from 'dayjs';

const YEAR_FORMAT = 'YYYY';
const YEAR_FORMAT_SHORT = 'YY';
const MONTH_NUMBER_FORMAT = 'MM';
const MONTH_WORDS_FORMAT = 'MMM';
const DAY_FORMAT = 'DD';
const HOURS_FORMAT = 'HH';
const MINUTES_FORMAT ='mm';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomPositiveFloat = (valueA, valueB, digits = 1) => {
  const lower = Math.min (Math.abs(valueA), Math.abs(valueB));
  const upper = Math.max (Math.abs(valueA), Math.abs(valueB));
  const result = Math.random () * (upper - lower) + lower;
  return result.toFixed (digits);
};

export const getTimeYYYYMMDD = (data) => dayjs(data).format(`${YEAR_FORMAT}-${MONTH_NUMBER_FORMAT}-${DAY_FORMAT}`);
export const getTimeHHMM = (data) => dayjs(data).format(`${HOURS_FORMAT}:${MINUTES_FORMAT}`);
export const getTimeYYYYMMDDHHMM = (data) => dayjs(data).format(`${YEAR_FORMAT}-${MONTH_NUMBER_FORMAT}-${DAY_FORMAT}T${getTimeHHMM(data)}`);
export const getTimeDDMMYYWithSlashAndHHMM = (data) => dayjs(data).format(`${DAY_FORMAT}/${MONTH_NUMBER_FORMAT}/${YEAR_FORMAT_SHORT} ${getTimeHHMM(data)}`);
export const getTimeMMDD = (data) => dayjs(data).format(`${MONTH_WORDS_FORMAT} ${DAY_FORMAT}`);

export const durationOfEventInMinutes = (timeStart, timeEnd) => dayjs(timeEnd).minute() - dayjs(timeStart).minute();
