import SiteMenuView from '@view/site-menu.js';
import TripInfoView from '@view/trip-info.js';
import FiltersView from '@view/filters.js';
import SortingView from '@view/sorting.js';
import EventListView from '@view/event-list.js';
import EmptyListView from '@view/empty-list.js';
import CreationOrEditingEventView from '@view/creation-or-editing-event.js';
import RoutePointView from '@view/route-point.js';
import { generatePoint } from '@mock/route-point.js';
import { render, replace } from '@utils/render.js';
import { Mode, LocationElement, Filter, KeyboardKey } from '@/const.js';

const POINT_COUNT = 5;

const siteNavigation = document.querySelector('.trip-controls__navigation');
const tripMain = document.querySelector('.trip-main');
const filters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const compare = (a, b) => a.dateFrom.diff(b.dateFrom);
points.sort(compare);

const renderPoint = (eventListView, point) => {
  const routePointView = new RoutePointView(point);
  const editEventView = new CreationOrEditingEventView(Mode.EDIT, point);

  // Callback используется по причине того, что происходит перекрестный вызов между функциями closeEditPointView и escKeyDownHandler
  // и я не вижу другого способа как решить проблему, что нельзя использовать функцию до ее объявления
  const closeEditPointView = (callbackForRemove) => {
    replace(routePointView, editEventView);
    document.removeEventListener('keydown', callbackForRemove);
  };

  const escKeyDownHandler = (evt) => {
    if (evt.key === KeyboardKey.ESCAPE || evt.key === KeyboardKey.ESC) {
      evt.preventDefault();
      closeEditPointView(escKeyDownHandler);
    }
  };

  const buttonExpandClickHandler = () => {
    replace(editEventView, routePointView);
    document.addEventListener('keydown', escKeyDownHandler);
  };

  const buttonRollupClickHandler = () => {
    closeEditPointView(escKeyDownHandler);
  };

  const formEditSubmitHandler = () => {
    closeEditPointView(escKeyDownHandler);
  };

  routePointView.setButtonExpandClickHandler(buttonExpandClickHandler);
  editEventView.setFormEditSubmitHandler(formEditSubmitHandler);
  editEventView.setButtonRollupClickHandler(buttonRollupClickHandler);

  render(eventListView, routePointView);
};

const renderInfoAboutTrip = (routePoints, filter = Filter.EVERYTHING) => {
  if (points.length === 0) {
    render(tripEvents, new EmptyListView(filter));
  } else {
    const eventListView = new EventListView();
    render(tripMain, new TripInfoView(routePoints), LocationElement.AFTERBEGIN);
    render(tripEvents, new SortingView());
    render(tripEvents, eventListView);
    for (let i = 0; i < routePoints.length; i++) {
      renderPoint(eventListView, routePoints[i]);
    }
  }
};

render(siteNavigation, new SiteMenuView());
render(filters, new FiltersView());
renderInfoAboutTrip(points);
