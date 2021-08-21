import dayjs from 'dayjs';

const sortPointsByDay = (pointFirst, pointSecond) => dayjs(pointFirst.dateFrom).diff(dayjs(pointSecond.dateFrom));

const sortPointsByPrice = (pointFirst, pointSecond) => pointSecond.basePrice - pointFirst.basePrice;

const sortPointsByTime = (pointFirst, pointSecond) =>
  dayjs(pointSecond.dateTo).diff(dayjs(pointSecond.dateFrom), 'minute') -
  dayjs(pointFirst.dateTo).diff(dayjs(pointFirst.dateFrom), 'minute');

export { sortPointsByDay, sortPointsByPrice, sortPointsByTime };
