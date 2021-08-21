import EventListView from '@view/event-list.js';
import EmptyListView from '@view/empty-list.js';
import TripInfoView from '@view/trip-info.js';
import SortingView from '@view/sorting.js';

import PointPresenter from './point.js';

import { render } from '@utils/render.js';
import { LocationElement } from '@/const.js';
import { updateItem } from './../utils/common.js';

export default class Trip {
  constructor(container, infoContainer, filter) {
    this._container = container;
    this._infoContainer = infoContainer;

    this._filter = filter;
    this._eventListView = new EventListView();
    this._emptyListView = new EmptyListView(this._filter);
    this._sortingView = new SortingView();
    this._pointPresenter = new Map();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(points) {
    this._points = points;
    this._infoView = new TripInfoView(this._points);
    this._renderInfo();
  }

  _renderEmptyList() {
    render(this._container, this._emptyListView);
  }

  _renderEventList() {
    render(this._container, this._eventListView);
  }

  _renderSummary() {
    render(this._infoContainer, this._infoView, LocationElement.AFTERBEGIN);
  }

  _renderSorting() {
    render(this._container, this._sortingView);
  }

  _renderInfo() {
    if (this._points.length === 0) {
      this._renderEmptyList();
    } else {
      this._renderSummary();
      this._renderSorting();
      this._renderEventList();
      this._points.forEach((point) => {
        const pointPresenter = new PointPresenter(this._eventListView, this._handlePointChange, this._handleModeChange);
        pointPresenter.init(point);
        pointPresenter.renderWaypoint();
        this._pointPresenter.set(point.id, pointPresenter);
      });
    }
  }

  _clearEventList() {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
  }

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handlePointChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }
}
