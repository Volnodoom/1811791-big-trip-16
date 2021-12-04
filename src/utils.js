import dayjs from 'dayjs';
import { KeyCode, TimeFormat } from './const';

export const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getTimeYYYYMMDD = (data) => dayjs(data).format(`${TimeFormat.YEAR_FORMAT}-${TimeFormat.MONTH_NUMBER_FORMAT}-${TimeFormat.DAY_FORMAT}`);
export const getTimeHHMM = (data) => dayjs(data).format(`${TimeFormat.HOURS_FORMAT}:${TimeFormat.MINUTES_FORMAT}`);
export const getTimeYYYYMMDDHHMM = (data) => dayjs(data).format(`${TimeFormat.YEAR_FORMAT}-${TimeFormat.MONTH_NUMBER_FORMAT}-${TimeFormat.DAY_FORMAT}T${getTimeHHMM(data)}`);
export const getTimeDDMMYYWithSlashAndHHMM = (data) => dayjs(data).format(`${TimeFormat.DAY_FORMAT}/${TimeFormat.MONTH_NUMBER_FORMAT}/${TimeFormat.YEAR_FORMAT_SHORT} ${getTimeHHMM(data)}`);
export const getTimeMMDD = (data) => dayjs(data).format(`${TimeFormat.MONTH_WORDS_FORMAT} ${TimeFormat.DAY_FORMAT}`);

export const durationOfEventInMinutes = (timeStart, timeEnd) => dayjs(timeEnd).diff(dayjs(timeStart), TimeFormat.MINUTES_FOR_DIFFERENCE);

export const isEsc = ({ code }) => code === KeyCode.ESCAPE;
