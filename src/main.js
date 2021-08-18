import SiteMenuView from '@view/site-menu.js';
import FiltersView from '@view/filters.js';
import { generatePoint } from '@mock/route-point.js';
import { render } from '@utils/render.js';
import { Filter } from '@/const.js';
import TripPresenter from './presenter/trip.js';

const POINT_COUNT = 5;

const siteNavigation = document.querySelector('.trip-controls__navigation');
const tripMain = document.querySelector('.trip-main');
const filters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const compare = (a, b) => a.dateFrom.diff(b.dateFrom);
points.sort(compare);

render(siteNavigation, new SiteMenuView());
render(filters, new FiltersView());

const tripPresenter = new TripPresenter(tripEvents, tripMain, Filter.EVERYTHING);
tripPresenter.init(points);
