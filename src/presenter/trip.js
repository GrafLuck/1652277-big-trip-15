import EventListView from '@view/event-list.js';
import EmptyListView from '@view/empty-list.js';
import TripInfoView from '@view/trip-info.js';
import SortingView from '@view/sorting.js';

import PointPresenter from './point.js';

import { render } from '@utils/render.js';
import { RoutePointOperationMode, LocationElement } from '@/const.js';

export default class Trip {
  constructor(tripContainer, tripInfoContainer, points, filter) {
    this._tripContainer = tripContainer;
    this._tripInfoContainer = tripInfoContainer;
    this._points = points;
    this._filter = filter;
    this._eventListView = new EventListView();
    this._emptyListView = new EmptyListView(this._filter);
    this._tripInfoView = new TripInfoView(this._points);
    this._sortingView = new SortingView();
  }

  _renderEmptyList() {
    render(this._tripContainer, this._emptyListView);
  }

  _renderEventList() {
    render(this._tripContainer, this._eventListView);
  }

  _renderTripInfo() {
    render(this._tripInfoContainer, this._tripInfoView, LocationElement.AFTERBEGIN);
  }

  _renderSorting() {
    render(this._tripContainer, this._sortingView);
  }

  renderInfoAboutTrip() {
    if (this._points.length === 0) {
      this._renderEmptyList();
    } else {
      this._renderTripInfo();
      this._renderSorting();
      this._renderEventList();
      this._points.forEach((point) => {
        const pointPresenter = new PointPresenter(this._eventListView, point, RoutePointOperationMode.EDIT);
        pointPresenter.renderPoint();
      });
    }
  }
}
