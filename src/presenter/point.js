import RoutePointView from '@view/route-point.js';
import CreationOrEditingEventView from '@view/creation-or-editing-event.js';
import { render, replace } from '@utils/render.js';
import { KeyboardKey } from '@/const.js';

export default class Point {
  constructor(pointContainer, point, operationMode) {
    this._pointConatianer = pointContainer;
    this._point = point;
    this._operationMode = operationMode;
    this._routePointView = new RoutePointView(this._point);
    this._operationPointView = new CreationOrEditingEventView(this._operationMode, this._point);
  }

  renderPoint() {

    const closeEditPointView = (handleEscKeyDown) => {
      replace(this._routePointView, this._operationPointView);
      document.removeEventListener('keydown', handleEscKeyDown);
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === KeyboardKey.ESCAPE || evt.key === KeyboardKey.ESC) {
        evt.preventDefault();
        closeEditPointView(escKeyDownHandler);
      }
    };

    const handleExpandButtonClick = () => {
      replace(this._operationPointView, this._routePointView);
      document.addEventListener('keydown', escKeyDownHandler);
    };

    const handleRollupButtonClick = () => {
      closeEditPointView(escKeyDownHandler);
    };

    const handleSubmit = () => {
      closeEditPointView(escKeyDownHandler);
    };

    this._routePointView.setRollupButtonClickHandler(handleExpandButtonClick);
    this._operationPointView.setSubmitHandler(handleSubmit);
    this._operationPointView.setRollupButtonClickHandler(handleRollupButtonClick);

    render(this._pointConatianer, this._routePointView);
  }
}
