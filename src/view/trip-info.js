import { formatDate } from '@utils/date.js';
import { DateFormat, QUANTITY_OF_CITIES_IN_TRIP } from '@/const.js';
import AbstractView from '@/view/abstract.js';

const createDurationInTemplate = (points) => {
  const dateFrom = points[0].dateFrom;
  const dateTo = points[points.length - 1].dateTo;
  return `${formatDate(dateFrom, DateFormat.ONLY_DATE_TERTIARY)}&nbsp;&mdash;&nbsp;${formatDate(dateTo, DateFormat.ONLY_DATE_TERTIARY)}`;
};

const createRouteInTemplate = (points) => {
  const routeСities = [];
  routeСities.push(points[0].destination.name);
  for (let i = 1; i < points.length; i++) {
    if (points[i].destination.name !== points[i - 1].destination.name) {
      routeСities.push(points[i].destination.name);
    }
  }

  let route = `${routeСities[0]}`;
  if (routeСities.length <= QUANTITY_OF_CITIES_IN_TRIP) {
    for (let i = 1; i < routeСities.length; i++) {
      route += ` &mdash; ${routeСities[i]}`;
    }
  } else {
    route += ` &mdash; ... &mdash; ${routeСities[routeСities.length - 1]}`;
  }

  return route;
};

const calculatePriceOfRoute = (points) => {
  let priceRoute = 0;
  const reducer = (accumulator, offer) => accumulator + offer.price;

  points.forEach((point) => {
    priceRoute += point.basePrice;
    priceRoute = point.offers.reduce(reducer, priceRoute);
  });

  return priceRoute;
};

export default class TripInfo extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return `<section class="trip-main__trip-info  trip-info">
              <div class="trip-info__main">
                <h1 class="trip-info__title">${createRouteInTemplate(this._points)}</h1>
                <p class="trip-info__dates">${createDurationInTemplate(this._points)}</p>
              </div>
              <p class="trip-info__cost">
                Total: &euro;&nbsp;<span class="trip-info__cost-value">${calculatePriceOfRoute(this._points)}</span>
              </p>
            </section>`;
  }
}
