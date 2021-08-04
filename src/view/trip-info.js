import { formatDate } from '@/utils.js';
import { DateFormat } from '@/const.js';

const createDuration = (points) => {
  const dateFrom = points[0].dateFrom;
  const dateTo = points[points.length - 1].dateTo;
  let durationInfo = `${formatDate(dateFrom, DateFormat.ONLY_DATE_TERTIARY)}&nbsp;&mdash;&nbsp;`;

  if (dateFrom.month() === dateTo.month()) {
    durationInfo += `${formatDate(dateTo, DateFormat.ONLY_DAY)}`;
  } else {
    durationInfo += `${formatDate(dateTo, DateFormat.ONLY_DATE_TERTIARY)}`;
  }
  return durationInfo;
};

const createRoute = (points) => {
  const routeСities = [];
  routeСities.push(points[0].destination.name);
  for (let i = 1; i < points.length; i++) {
    if (points[i].destination.name !== points[i - 1].destination.name) {
      routeСities.push(points[i].destination.name);
    }
  }

  let route = `${routeСities[0]}`;
  if (routeСities.length <= 3) {
    for (let i = 1; i < routeСities.length; i++) {
      route += ` &mdash; ${routeСities[i]}`;
    }
  } else {
    route += ` &mdash; ... &mdash; ${routeСities[routeСities.length - 1]}`;
  }

  return route;
};

const createPriceRoute = (points) => {
  let priceRoute = 0;

  points.forEach((point) => {
    priceRoute += point.basePrice;
    for (let i = 0; i < point.offers.length; i++) {
      priceRoute += point.offers[i].price;
    }
  });

  return priceRoute;
};

export const createTripInfoTemplate = (points) => {
  let tripInfoTemplate = '';
  if (points !== undefined) {
    tripInfoTemplate += `<section class="trip-main__trip-info  trip-info">
              <div class="trip-info__main">
                <h1 class="trip-info__title">${createRoute(points)}</h1>
                <p class="trip-info__dates">${createDuration(points)}</p>
              </div>
              <p class="trip-info__cost">
                Total: &euro;&nbsp;<span class="trip-info__cost-value">${createPriceRoute(points)}</span>
              </p>
            </section>`;
  }
  return tripInfoTemplate;
};
