import { createSiteMenuTemplate } from './view/site-menu.js';
import { createTripInfoTemplate } from './view/trip-info.js';
import { createFiltersTemplate } from './view/filters.js';
import { createSortingTemplate } from './view/sorting.js';

const siteNavigationElement = document.querySelector('.trip-controls__navigation');
const tripMainElement = document.querySelector('.trip-main');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(siteNavigationElement, createSiteMenuTemplate(), 'beforeend');
render(tripMainElement, createTripInfoTemplate(), 'afterbegin')
render(filtersElement, createFiltersTemplate(), 'beforeend');
render(tripEventsElement, createSortingTemplate(), 'beforeend');
