import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Time } from '@/const.js';

dayjs.extend(duration);

const formatDate = (date, format) => dayjs(date).format(format);

const formatDuration = (dateFrom, dateTo) => {
  const durationInMinutes = dateTo.diff(dateFrom, 'minute');
  let dateFormat = '';
  let days = 0;
  let hours = 0;
  let minutes = 0;
  if (durationInMinutes < Time.MINUTES_PER_HOUR) {
    dateFormat = 'mm[M]';
    minutes = durationInMinutes;
  } else if (durationInMinutes < Time.MINUTES_PER_DAY) {
    dateFormat = 'HH[H] mm[M]';
    hours = Math.floor(durationInMinutes / Time.MINUTES_PER_HOUR);
    minutes = durationInMinutes % Time.MINUTES_PER_HOUR;
  } else {
    dateFormat = 'DD[D] HH[H] mm[M]';
    days = Math.floor(durationInMinutes / Time.MINUTES_PER_DAY);
    hours = Math.floor(durationInMinutes / Time.MINUTES_PER_HOUR) - days * Time.HOURS_PER_DAY;
    minutes = durationInMinutes - days * Time.MINUTES_PER_DAY - hours * Time.MINUTES_PER_HOUR;
  }
  return dayjs.duration({ minutes: minutes, hours: hours, days: days }).format(dateFormat);
};

export { formatDate, formatDuration };