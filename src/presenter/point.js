import RoutePointView from '@view/route-point.js';
import CreationOrEditingEventView from '@view/creation-or-editing-event.js';
import { render, replace, remove } from '@utils/render.js';
import { KeyboardKey, RoutePointOperationMode } from '@/const.js';

export default class Point {
  constructor(container, changeData, changeMode) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._mode = RoutePointOperationMode.VIEW;

    this._waypointView = null;
    this._operationView = null;

    this._handleExpandButtonClick = this._handleExpandButtonClick.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleRollupButtonClick = this._handleRollupButtonClick.bind(this);
    this._escKeydownHandler = this._escKeydownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(point) {
    this._waypoint = point;

    const prevWaypointView = this._waypointView;
    const prevOperationView = this._operationView;

    this._waypointView = new RoutePointView(this._waypoint);
    if (this._waypoint === null) {
      this._operationView = new CreationOrEditingEventView(RoutePointOperationMode.CREATE, this._waypoint);
    } else {
      this._operationView = new CreationOrEditingEventView(RoutePointOperationMode.EDIT, this._waypoint);
    }

    this._setHandlers();

    if (prevWaypointView === null || prevOperationView === null) {
      render(this._container, this._waypointView);
      return;
    }

    if (this._mode === RoutePointOperationMode.VIEW) {
      replace(this._waypointView, prevWaypointView);
    }

    if (this._mode === RoutePointOperationMode.EDIT) {
      replace(this._operationView, prevOperationView);
    }

    remove(prevWaypointView);
    remove(prevOperationView);
  }

  destroy() {
    remove(this._waypointView);
    remove(this._operationView);
  }

  resetView() {
    if (this._mode !== RoutePointOperationMode.VIEW) {
      this._closeEditWaypointView(this._escKeydownHandler);
    }
  }

  renderWaypoint() {
    render(this._container, this._waypointView);
  }

  _setHandlers() {
    this._waypointView.setRollupButtonClickHandler(this._handleExpandButtonClick);
    this._operationView.setSubmitHandler(this._handleSubmit);
    this._operationView.setRollupButtonClickHandler(this._handleRollupButtonClick);
    this._waypointView.setFavoriteClickHandler(this._handleFavoriteClick);
  }

  _closeEditWaypointView(escKeydownHandler) {
    replace(this._waypointView, this._operationView);
    document.removeEventListener('keydown', escKeydownHandler);
    this._mode = RoutePointOperationMode.VIEW;
  }

  _handleExpandButtonClick() {
    replace(this._operationView, this._waypointView);
    document.addEventListener('keydown', this._escKeydownHandler);
    this._changeMode();
    this._mode = RoutePointOperationMode.EDIT;
  }

  _handleRollupButtonClick() {
    this._closeEditWaypointView(this._escKeydownHandler);
  }

  _handleSubmit(point) {
    this._changeData(point);
    this._closeEditWaypointView(this._escKeydownHandler);
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._waypoint,
        {
          isFavorite: !this._waypoint.isFavorite,
        },
      ),
    );
  }

  _escKeydownHandler(evt) {
    if (evt.key === KeyboardKey.ESCAPE || evt.key === KeyboardKey.ESC) {
      evt.preventDefault();
      this._operationView.reset(this._waypoint);
      this._closeEditWaypointView(this._escKeydownHandler);
    }
  }
}
