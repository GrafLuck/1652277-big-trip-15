import { createSiteMenuTemplate } from '@view/site-menu.js';
import { createTripInfoTemplate } from '@view/trip-info.js';
import { createFiltersTemplate } from '@view/filters.js';
import { createSortingTemplate } from '@view/sorting.js';
import { createEventListTemplate } from '@view/event-list.js';
import { createAddEventTemplate } from '@view/new-event.js';
import { createEditEventTemplate } from '@view/edit-event.js';
import { createRoutePointTemplate } from '@view/route-point.js';
import { generatePoint } from '@mock/route-point.js';

const POINT_COUNT = 10;

const siteNavigation = document.querySelector('.trip-controls__navigation');
const tripMain = document.querySelector('.trip-main');
const filters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

render(siteNavigation, createSiteMenuTemplate());
render(tripMain, createTripInfoTemplate(), 'afterbegin');
render(filters, createFiltersTemplate());
render(tripEvents, createSortingTemplate());
render(tripEvents, createEventListTemplate());

const tripEventsList = document.querySelector('.trip-events__list');

render(tripEventsList, createEditEventTemplate(points[0]));
render(tripEventsList, createAddEventTemplate());
for (let i = 1; i < POINT_COUNT; i++) {
  render(tripEventsList, createRoutePointTemplate(points[i]));
}
