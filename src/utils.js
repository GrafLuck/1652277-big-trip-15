import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Time, DateFormat } from '@/const.js';

dayjs.extend(duration);

const formatDate = (date, format) => dayjs(date).format(format);

const formatDuration = (dateFrom, dateTo) => {
  const durationInMinutes = dateTo.diff(dateFrom, 'minute');
  let dateFormat = '';
  let days = 0;
  let hours = 0;
  let minutes = 0;
  if (durationInMinutes < Time.MINUTES_PER_HOUR) {
    dateFormat = DateFormat.ONLY_MINUTES_WITH_DESCRIPTION;
    minutes = durationInMinutes;
  } else if (durationInMinutes < Time.MINUTES_PER_DAY) {
    dateFormat = DateFormat.ONLY_TIME_WITH_DESCRIPTION;
    hours = Math.floor(durationInMinutes / Time.MINUTES_PER_HOUR);
    minutes = durationInMinutes % Time.MINUTES_PER_HOUR;
  } else {
    dateFormat = DateFormat.FULL_DURATION;
    days = Math.floor(durationInMinutes / Time.MINUTES_PER_DAY);
    hours = Math.floor(durationInMinutes / Time.MINUTES_PER_HOUR) - days * Time.HOURS_PER_DAY;
    minutes = durationInMinutes - days * Time.MINUTES_PER_DAY - hours * Time.MINUTES_PER_HOUR;
  }
  return dayjs.duration({ minutes, hours, days }).format(dateFormat);
};

const renderElement = (container, element, place = 'beforeend') => {
  if (place === 'beforeend') {
    container.append(element);
  } else if (place === 'afterbegin') {
    container.prepend(element);
  }
};

const renderTemplate = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export { formatDate, formatDuration };
export { renderElement, renderTemplate, createElement };
