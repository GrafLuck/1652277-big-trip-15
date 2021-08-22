import { getRoutePointTypes, getDestinationNames, getOffers, getDestinations } from '@mock/route-point.js';
import { formatDate } from '@utils/date.js';
import { DateFormat, RoutePointOperationMode, ButtonLabel } from '@/const.js';
import SmartView from '@view/smart.js';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const blankPoint = {
  basePrice: 0,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: getDestinations()[0],
  id: 0,
  isFavorite: false,
  offers: [],
  type: getRoutePointTypes()[0],
};

const checkEntry = (value, entries) => Boolean(entries.find(({ title }) => title === value));

const createDescriptionOfPointInTemplate = (description) => `<p class="event__destination-description">${description}</p>`;

const createListOfPicturesInTemplate = (pictures) => {
  let list = '';
  for (const picture of pictures) {
    list += `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
  }
  return list;
};

const createRoutePointTypesInTemplate = (type) => {
  const routePointTypes = getRoutePointTypes();
  let list = '';

  for (const point of routePointTypes) {
    const pointWithFirstCapitalLetter = point[0].toUpperCase() + point.slice(1);
    list += `<div class="event__type-item">
      <input id="event-type-${point}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${point}" ${type === point ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${point}" for="event-type-${point}-1">${pointWithFirstCapitalLetter}</label>
    </div>`;
  }
  return list;
};

const createDestinationNamesInTemplate = () => {
  const destinationNames = getDestinationNames();
  let list = '';
  for (const name of destinationNames) {
    list += `<option value="${name}">${name}</option>`;
  }
  return list;
};

const createListOfOffersInTemplate = (allOffers, checkedOffers) => {
  let list = '';
  for (const offer of allOffers) {
    const lastWordOfTitle = offer.title.split(' ').pop();
    const isChecked = checkEntry(offer['title'], checkedOffers);
    list +=
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${lastWordOfTitle}-1" type="checkbox" name="event-offer-${lastWordOfTitle}" ${isChecked ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${lastWordOfTitle}-1">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`;
  }
  return list;
};

const createSectionOfOffersInTemplate = (allOffers, checkedOffers) => {
  if (allOffers.length !== 0) {
    return `
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${createListOfOffersInTemplate(allOffers, checkedOffers)}
        </div>
      </section>`;
  }
  return '';
};

const createSectionOfDestinationInTemplate = (destination) => {
  const { description, pictures } = destination;
  if (description.length === 0 && pictures.length === 0) {
    return '';
  }
  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${createDescriptionOfPointInTemplate(description)}
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${createListOfPicturesInTemplate(pictures)}
        </div>
      </div>
    </section>`;
};

export default class CreationOrEditingEvent extends SmartView {
  constructor(mode = RoutePointOperationMode.CREATE, point = blankPoint) {
    super();
    this._mode = mode;
    this._dateFromPicker = null;
    this._dateToPicker = null;

    this._data = CreationOrEditingEvent.parsePointToData(point);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._rollupButtonClickHandler = this._rollupButtonClickHandler.bind(this);
    this._typeInputChangeHandler = this._typeInputChangeHandler.bind(this);
    this._inputDestinationChangeHandler = this._inputDestinationChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._startTimeChangeHandler = this._startTimeChangeHandler.bind(this);
    this._endTimeChangeHandler = this._endTimeChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatePicker();
  }

  reset(point) {
    this.updateData(
      CreationOrEditingEvent.parsePointToData(point),
    );
  }

  getTemplate() {
    const { basePrice, dateFrom, dateTo, destination, offers, type } = this._data;
    const { name } = destination;
    const isEdit = this._mode === RoutePointOperationMode.EDIT;

    return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${createRoutePointTypesInTemplate(type)}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">${type}</label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
                    <datalist id="destination-list-1">
                      ${createDestinationNamesInTemplate()}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(dateFrom, DateFormat.FULL_DATE)}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(dateTo, DateFormat.FULL_DATE)}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">${isEdit ? ButtonLabel.DELETE : ButtonLabel.CANCEL}</button>
                  ${isEdit ? `
                        <button class="event__rollup-btn" type = "button">
                          <span class="visually-hidden">Open event</span>
                        </button >` : ''}
                </header>
                <section class="event__details">
                  ${createSectionOfOffersInTemplate(getOffers(type, false), offers)}
                  ${createSectionOfDestinationInTemplate(destination)}
                </section>
              </form>
            </li>`;
  }

  setSubmitHandler(callback) {
    this._callback.handleFormSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setRollupButtonClickHandler(callback) {
    this._callback.handleRollupButtonClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollupButtonClickHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.handleFormSubmit(CreationOrEditingEvent.parseDataToPoint(this._data));
  }

  _rollupButtonClickHandler() {
    this._callback.handleRollupButtonClick();
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._typeInputChangeHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._inputDestinationChangeHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._priceInputHandler);
  }

  _setDatePicker() {
    if (this._dateFromPicker) {
      this._dateFromPicker.destroy();
      this._dateFromPicker = null;
    }

    if (this._dateToPicker) {
      this._dateToPicker.destroy();
      this._dateToPicker = null;
    }

    this._dateFromPicker = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateFrom.valueOf(),
        maxDate: this._data.dateTo.valueOf(),
        onChange: this._startTimeChangeHandler,
      },
    );

    this._dateToPicker = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateTo.valueOf(),
        minDate: this._data.dateFrom.valueOf(),
        onChange: this._endTimeChangeHandler,
      },
    );
  }

  _typeInputChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({ type: evt.target.value }, false);
  }

  _inputDestinationChangeHandler(evt) {
    evt.preventDefault();
    const destination = getDestinations().find((element) => element.name === evt.target.value);
    this._data.destination = Object.assign({}, destination);
    this.updateElement();
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      basePrice: evt.target.value,
    }, true);
  }

  _startTimeChangeHandler([userDate]) {
    this.updateData({
      dateFrom: userDate,
    });
  }

  _endTimeChangeHandler([userDate]) {
    this.updateData({
      dateTo: userDate,
    });
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatePicker();
    this.setSubmitHandler(this._callback.handleFormSubmit);
    this.setRollupButtonClickHandler(this._callback.handleRollupButtonClick);
  }

  static parsePointToData(point) {
    return Object.assign(
      {},
      point,
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);
    return data;
  }
}

