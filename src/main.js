import SiteMenuView from '@view/site-menu.js';
import TripInfoView from '@view/trip-info.js';
import FiltersView from '@view/filters.js';
import SortingView from '@view/sorting.js';
import EventListView from '@view/event-list.js';
import EmptyListView from '@view/empty-list.js';
import CreationOrEditingEventView from '@view/creation-or-editing-event.js';
import RoutePointView from '@view/route-point.js';
import { generatePoint } from '@mock/route-point.js';
import { render } from '@/utils.js';
import { Mode, LocationElement, Filter, KeyboardKey } from '@/const.js';

const POINT_COUNT = 5;

const siteNavigation = document.querySelector('.trip-controls__navigation');
const tripMain = document.querySelector('.trip-main');
const filters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const compare = (a, b) => a.dateFrom.diff(b.dateFrom);
points.sort(compare);

const renderPoint = (eventList, point) => {
  const routePointView = new RoutePointView(point);
  const routePoint = routePointView.getElement();
  const buttonExpand = routePoint.querySelector('.event__rollup-btn');

  const editEventView = new CreationOrEditingEventView(Mode.EDIT, point);
  const editPoint = editEventView.getElement();
  const formEdit = editPoint.querySelector('form');
  const buttonRollup = formEdit.querySelector('.event__rollup-btn');

  // Callback используется по причине того, что происходит перекрестный вызов между функциями closeEditPointView и escKeyDownHandler
  // и я не вижу другого способа как решить проблему, что нельзя использовать функцию до ее объявления
  const closeEditPointView = (callbackForRemove) => {
    eventList.replaceChild(routePoint, editPoint);
    document.removeEventListener('keydown', callbackForRemove);
  };

  const escKeyDownHandler = (evt) => {
    if (evt.key === KeyboardKey.ESCAPE || evt.key === KeyboardKey.ESC) {
      evt.preventDefault();
      closeEditPointView(escKeyDownHandler);
    }
  };

  const buttonExpandClickHandler = () => {
    eventList.replaceChild(editPoint, routePoint);
    document.addEventListener('keydown', escKeyDownHandler);
  };

  const buttonRollupClickHandler = () => {
    closeEditPointView(escKeyDownHandler);
  };

  const formEditSubmitHandler = (evt) => {
    evt.preventDefault();
    closeEditPointView(escKeyDownHandler);
  };

  buttonExpand.addEventListener('click', buttonExpandClickHandler);
  buttonRollup.addEventListener('click', buttonRollupClickHandler);
  formEdit.addEventListener('submit', formEditSubmitHandler);

  render(eventList, routePoint);
};

const renderInfoAboutTrip = (routePoints, filter = Filter.EVERYTHING) => {
  if (points.length === 0) {
    render(tripEvents, new EmptyListView(filter).getElement());
  } else {
    const eventList = new EventListView().getElement();
    render(tripMain, new TripInfoView(routePoints).getElement(), LocationElement.AFTERBEGIN);
    render(tripEvents, new SortingView().getElement());
    render(tripEvents, eventList);
    for (let i = 0; i < routePoints.length; i++) {
      renderPoint(eventList, routePoints[i]);
    }
  }
};

render(siteNavigation, new SiteMenuView().getElement());
render(filters, new FiltersView().getElement());
renderInfoAboutTrip(points);
