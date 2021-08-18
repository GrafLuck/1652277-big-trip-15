import RoutePointView from '@view/route-point.js';
import CreationOrEditingEventView from '@view/creation-or-editing-event.js';
import { render, replace, remove } from '@utils/render.js';
import { KeyboardKey } from '@/const.js';

export default class Point {
  constructor(pointContainer, changeData, operationMode) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._operationMode = operationMode;

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
    this._operationPointView = new CreationOrEditingEventView(this._operationMode, this._point);

    this._setHandler();

    if (prevRoutePointView === null || prevOperationPointView === null) {
      render(this._pointContainer, this._routePointView);
      return;
    }

    if (this._pointContainer.getElement().contains(prevRoutePointView.getElement())) {
      replace(this._routePointView, prevRoutePointView);
    }

    if (this._pointContainer.getElement().contains(prevOperationPointView.getElement())) {
      replace(this._operationPointView, prevOperationPointView);
    }

    remove(prevRoutePointView);
    remove(prevOperationPointView);
  }

  destroy() {
    remove(this._routePointView);
    remove(this._operationPointView);
  }

  _closeEditPointView(handleEscKeyDown) {
    replace(this._routePointView, this._operationPointView);
    document.removeEventListener('keydown', handleEscKeyDown);
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
  }

  _handleRollupButtonClick() {
    this._closeEditPointView(this._escKeyDownHandler);
  }

  _handleSubmit(point) {
    this._changeData(point);
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
