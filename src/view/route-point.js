import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 1440;

const createListOffers = (offers) => {

  const eventList = document.createElement('ul');
  eventList.classList.add('event__selected-offers');

  for (let i = 0; i < offers.length; i++) {

    const eventOffer = `<li class="event__offer">
        <span class="event__offer-title">${offers[i].title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offers[i].price}</span>
      </li>`;

    eventList.insertAdjacentHTML('beforeend', eventOffer);
  }
  return eventList.outerHTML;
};

const formatDate = (date) => dayjs(date).format('YYYY-MM-DD');

const formatTime = (date) => dayjs(date).format('HH:mm');

const formatFullDate = (date) => `${formatDate(date)}T${formatTime(date)}`;

const formatShortDate = (date) => dayjs(date).format('MMM DD');

const formatDurationEvent = (dateFrom, dateTo) => {
  const durationInMinutes = dateTo.diff(dateFrom, 'minute');
  let dateFormat = '';
  let days = 0;
  let hours = 0;
  let minutes = 0;
  if (durationInMinutes < MINUTES_PER_HOUR) {
    dateFormat = 'mm[M]';
    minutes = durationInMinutes;
  } else if (durationInMinutes < MINUTES_PER_DAY) {
    dateFormat = 'HH[H] mm[M]';
    hours = Math.floor(durationInMinutes / MINUTES_PER_HOUR);
    minutes = durationInMinutes % MINUTES_PER_HOUR;
  } else {
    dateFormat = 'DD[D] HH[H] mm[M]';
    days = Math.floor(durationInMinutes / MINUTES_PER_DAY);
    hours = Math.floor(durationInMinutes / MINUTES_PER_HOUR) - days * HOURS_PER_DAY;
    minutes = durationInMinutes - days * MINUTES_PER_DAY - hours * MINUTES_PER_HOUR;
  }
  return dayjs.duration({ minutes: minutes, hours: hours, days: days }).format(dateFormat);
};

export const createRoutePointTemplate = (point) => {

  const { basePrice, dateFrom, dateTo, destination, isFavorite, offers, type } = point;
  const { name } = destination;
  const listOffers = createListOffers(offers);

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${formatDate(dateFrom)}">${formatShortDate(dateFrom)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${formatFullDate(dateFrom)}">${formatTime(dateFrom)}</time>
          &mdash;
          <time class="event__end-time" datetime="${formatFullDate(dateTo)}">${formatTime(dateTo)}</time>
        </p>
        <p class="event__duration">${formatDurationEvent(dateFrom, dateTo)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      ${listOffers}
      <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};
