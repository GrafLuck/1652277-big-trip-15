import EventListView from '@view/event-list.js';
import EmptyListView from '@view/empty-list.js';
import TripInfoView from '@view/trip-info.js';
import SortingView from '@view/sorting.js';

import PointPresenter from './point.js';

import { render } from '@utils/render.js';
import { RoutePointOperationMode, LocationElement } from '@/const.js';
import { updateItem } from './../utils/common.js';

export default class Trip {
  constructor(tripContainer, tripInfoContainer, filter) {
    this._tripContainer = tripContainer;
    this._tripInfoContainer = tripInfoContainer;

    this._filter = filter;
    this._eventListView = new EventListView();
    this._emptyListView = new EmptyListView(this._filter);
    this._sortingView = new SortingView();
    this._pointPresenter = new Map();

    this._handlePointChange = this._handlePointChange.bind(this);
  }

  init(points) {
    this._points = points;
    this._tripInfoView = new TripInfoView(this._points);
    this._renderInfoAboutTrip();
  }

  _handlePointChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
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

  _clearEventList() {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
  }

  _renderInfoAboutTrip() {
    if (this._points.length === 0) {
      this._renderEmptyList();
    } else {
      this._renderTripInfo();
      this._renderSorting();
      this._renderEventList();
      this._points.forEach((point) => {
        const pointPresenter = new PointPresenter(this._eventListView, this._handlePointChange, RoutePointOperationMode.EDIT);
        pointPresenter.init(point);
        pointPresenter.renderPoint();
        this._pointPresenter.set(point.id, pointPresenter);
      });
    }
  }

}
