import dayjs from 'dayjs';
import { DAY_FORMAT, FilterLabelStartFrame, FIVE, KeyCode, MINUTES, NOTHING, ONE_DAY, ONE_HOUR, TimeFormat, TWENTY_FOUR_HOURS } from './const';

export const getTimeYYYYMMDD = (data) => dayjs(data).format(`${TimeFormat.YEAR_FORMAT}-${TimeFormat.MONTH_NUMBER_FORMAT}-${TimeFormat.DAY_FORMAT}`);
export const getTimeHHMM = (data) => dayjs(data).format(`${TimeFormat.HOURS_FORMAT}:${TimeFormat.MINUTES_FORMAT}`);
export const getTimeYYYYMMDDHHMM = (data) => dayjs(data).format(`${TimeFormat.YEAR_FORMAT}-${TimeFormat.MONTH_NUMBER_FORMAT}-${TimeFormat.DAY_FORMAT}T${getTimeHHMM(data)}`);
export const getTimeDDMMYYWithSlashAndHHMM = (data) => dayjs(data).format(`${TimeFormat.DAY_FORMAT}/${TimeFormat.MONTH_NUMBER_FORMAT}/${TimeFormat.YEAR_FORMAT_SHORT} ${getTimeHHMM(data)}`);
export const getTimeMMDD = (data) => dayjs(data).format(`${TimeFormat.MONTH_WORDS_FORMAT} ${TimeFormat.DAY_FORMAT}`);

export const durationOfEventInMinutes = (timeStart, timeEnd) => dayjs(timeEnd).diff(dayjs(timeStart), TimeFormat.MINUTES_FOR_DIFFERENCE);

export const durationOfOnePointEvent = (difference) => {
  switch (true) {
    case (difference < ONE_HOUR) :
      return `${difference}M`;
    case (difference < TWENTY_FOUR_HOURS) :
      return `${Math.floor(difference/ONE_HOUR)}H ${difference%ONE_HOUR}M`;
    case (difference >= TWENTY_FOUR_HOURS) :
      return `${Math.floor(difference/TWENTY_FOUR_HOURS)}D ${Math.floor(difference%TWENTY_FOUR_HOURS/ONE_HOUR)}H ${difference%TWENTY_FOUR_HOURS%ONE_HOUR}M`;
  }
};

export const isEsc = ({ code }) => code === KeyCode.ESCAPE;

export const sortDate = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

export const sortDuration = (pointA, pointB) => {
  const valueA = durationOfEventInMinutes(pointA.dateFrom, pointA.dateTo);
  const valueB = durationOfEventInMinutes(pointB.dateFrom, pointB.dateTo);
  return valueB-valueA;
};

export const sortPrice = (pointA, pointB) => pointB.basePrice-pointA.basePrice;

const isPointInProcessOfHappening = (point) => {
  if((dayjs(point.dateFrom).diff(dayjs()) < NOTHING) &&  (dayjs(point.dateTo).diff(dayjs()) >= NOTHING)) {
    return true;
  } else {
    return false;
  }
};

export const filterPointsForTimeDifference = {
  [FilterLabelStartFrame.EVERYTHING.filter]: (points) => points,
  [FilterLabelStartFrame.FUTURE.filter]: (points) => points.filter((point) => (dayjs(point.dateFrom).diff(dayjs()) >= NOTHING) || isPointInProcessOfHappening(point)),
  [FilterLabelStartFrame.PAST.filter]: (points) => points.filter((point) => (dayjs(point.dateFrom).diff(dayjs()) < NOTHING) || isPointInProcessOfHappening(point)),
};

export const isDayEndEarlyDayStartFlatpicker = (dayStart, dayEnd) => dayjs(dayEnd).diff(dayjs(dayStart).subtract(ONE_DAY, DAY_FORMAT)) < NOTHING;
export const isDayEndEarlyDayStart = (dayStart, dayEnd) => dayjs(dayEnd).diff(dayjs(dayStart)) < NOTHING;
export const addFiveMinutes = (date) =>  dayjs(date).add(FIVE, MINUTES);
export const correctDateFormatForFlitpicker = (date) => dayjs(date).format('DD/MM/YYYY HH:mm');

export const calculateTotalMoneyForEventType = (eventType, points) => points
  .filter((point) => point.travelType === eventType)
  .reduce((accumulator, element) => accumulator + Number(element.basePrice), NOTHING);

export const calculateFrequencyOfType = (eventType, points) => points
  .filter((point) => point.travelType === eventType).length;

export const calculateTotalTimeForEventType = (eventType, points) => points
  .filter((point) => point.travelType === eventType)
  .reduce((accumulator, element) =>
    accumulator + durationOfEventInMinutes (element.dateFrom, element.dateTo), NOTHING);
