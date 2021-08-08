import SiteMenuView from '@view/site-menu.js';
import TripInfoView from '@view/trip-info.js';
import FiltersView from '@view/filters.js';
import SortingView from '@view/sorting.js';
import { createEventListTemplate } from '@view/event-list.js';
import CreateOrEditEventView from '@view/create-or-edit-event.js';
import RoutePointView from '@view/route-point.js';
import { generatePoint } from '@mock/route-point.js';
import { renderTemplate, renderElement } from '@/utils.js';

const POINT_COUNT = 5;

const siteNavigation = document.querySelector('.trip-controls__navigation');
const tripMain = document.querySelector('.trip-main');
const filters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const compare = (a, b) => a.dateFrom.diff(b.dateFrom);
points.sort(compare);


renderElement(siteNavigation, new SiteMenuView().getElement());
renderElement(tripMain, new TripInfoView(points).getElement(), 'afterbegin');
renderElement(filters, new FiltersView().getElement());
renderElement(tripEvents, new SortingView().getElement());
renderTemplate(tripEvents, createEventListTemplate());

const tripEventsList = document.querySelector('.trip-events__list');

renderElement(tripEventsList, new CreateOrEditEventView(points[0]).getElement());
for (let i = 1; i < POINT_COUNT; i++) {
  renderElement(tripEventsList, new RoutePointView(points[i]).getElement());
}
