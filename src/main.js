import SiteMenuView from '@view/site-menu.js';
import TripInfoView from '@view/trip-info.js';
import FiltersView from '@view/filters.js';
import SortingView from '@view/sorting.js';
import EventList from '@view/event-list.js';
import CreateOrEditEventView from '@view/create-or-edit-event.js';
import RoutePointView from '@view/route-point.js';
import { generatePoint } from '@mock/route-point.js';
import { render } from '@/utils.js';
import { Mode, LocationElement } from '@/const.js';

const POINT_COUNT = 5;

const siteNavigation = document.querySelector('.trip-controls__navigation');
const tripMain = document.querySelector('.trip-main');
const filters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const compare = (a, b) => a.dateFrom.diff(b.dateFrom);
points.sort(compare);


render(siteNavigation, new SiteMenuView().getElement());
render(tripMain, new TripInfoView(points).getElement(), LocationElement.AFTERBEGIN);
render(filters, new FiltersView().getElement());
render(tripEvents, new SortingView().getElement());
render(tripEvents, new EventList().getElement());

const tripEventsList = document.querySelector('.trip-events__list');

const renderPoint = (eventList, point) => {
  const routePointView = new RoutePointView(point);
  const routePoint = routePointView.getElement();
  const buttonExpand = routePoint.querySelector('.event__rollup-btn');

  const editEventView = new CreateOrEditEventView(Mode.EDIT, point);
  const editablePoint = editEventView.getElement();
  const formEdit = editablePoint.querySelector('form');
  const buttonRollup = formEdit.querySelector('.event__rollup-btn');

  const buttonExpandClickHandler = () => {
    eventList.replaceChild(editablePoint, routePoint);
  };

  const buttonRollupClickHandler = () => {
    eventList.replaceChild(routePoint, editablePoint);
  };

  const formEditSubmitHandler = (evt) => {
    evt.preventDefault();
    eventList.replaceChild(routePoint, editablePoint);
  };


  buttonExpand.addEventListener('click', buttonExpandClickHandler);
  buttonRollup.addEventListener('click', buttonRollupClickHandler);
  formEdit.addEventListener('submit', formEditSubmitHandler);

  render(eventList, routePoint);
};

for (let i = 0; i < POINT_COUNT; i++) {
  renderPoint(tripEventsList, points[i]);
}
