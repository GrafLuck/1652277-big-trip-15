import RoutePointView from '@view/route-point.js';
import CreationOrEditingEventView from '@view/creation-or-editing-event.js';
import { render, replace, remove } from '@utils/render.js';
import { KeyboardKey, RoutePointOperationMode } from '@/const.js';

export default class Point {
  constructor(pointContainer, changeData, changeMode) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._mode = RoutePointOperationMode.VIEW;

    this._routePointView = null;
    this._operationPointView = null;

    this._handleExpandButtonClick = this._handleExpandButtonClick.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleRollupButtonClick = this._handleRollupButtonClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(point) {
    this._point = point;

    const prevRoutePointView = this._routePointView;
    const prevOperationPointView = this._operationPointView;

    this._routePointView = new RoutePointView(this._point);
    if (this._point === null) {
      this._operationPointView = new CreationOrEditingEventView(RoutePointOperationMode.CREATE, this._point);
    } else {
      this._operationPointView = new CreationOrEditingEventView(RoutePointOperationMode.EDIT, this._point);
    }

    this._setHandler();

    if (prevRoutePointView === null || prevOperationPointView === null) {
      render(this._pointContainer, this._routePointView);
      return;
    }

    if (this._mode === RoutePointOperationMode.VIEW) {
      replace(this._routePointView, prevRoutePointView);
    }

    if (this._mode === RoutePointOperationMode.EDIT) {
      replace(this._operationPointView, prevOperationPointView);
    }

    remove(prevRoutePointView);
    remove(prevOperationPointView);
  }

  destroy() {
    remove(this._routePointView);
    remove(this._operationPointView);
  }

  resetView() {
    if (this._mode !== RoutePointOperationMode.VIEW) {
      this._closeEditPointView(this._escKeyDownHandler);
    }
  }

  _closeEditPointView(handleEscKeyDown) {
    replace(this._routePointView, this._operationPointView);
    document.removeEventListener('keydown', handleEscKeyDown);
    this._mode = RoutePointOperationMode.VIEW;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === KeyboardKey.ESCAPE || evt.key === KeyboardKey.ESC) {
      evt.preventDefault();
      this._closeEditPointView(this._escKeyDownHandler);
    }
  }

  _handleExpandButtonClick() {
    replace(this._operationPointView, this._routePointView);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = RoutePointOperationMode.EDITING;
  }

  _handleRollupButtonClick() {
    this._closeEditPointView(this._escKeyDownHandler);
  }

  _handleSubmit() {
    this._closeEditPointView(this._escKeyDownHandler);
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }

  _setHandler() {
    this._routePointView.setRollupButtonClickHandler(this._handleExpandButtonClick);
    this._operationPointView.setSubmitHandler(this._handleSubmit);
    this._operationPointView.setRollupButtonClickHandler(this._handleRollupButtonClick);
    this._routePointView.setFavoriteClickHandler(this._handleFavoriteClick);
  }

  renderPoint() {
    render(this._pointContainer, this._routePointView);
  }
}
