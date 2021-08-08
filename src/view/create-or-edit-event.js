import { getRoutePointTypes, getDestinationNames, getOffers, getDestinations } from '@mock/route-point.js';
import { createElement, formatDate } from '@/utils.js';
import { DateFormat } from '@/const.js';

const createRoutePointTypesInTemplate = (type) => {
  const routePointTypes = getRoutePointTypes();
  let list = '';

  for (const point of routePointTypes) {
    const lowerCasePoint = point.toLowerCase();
    list += `<div class="event__type-item">
      <input id="event-type-${lowerCasePoint}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${lowerCasePoint}" ${type === point ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${lowerCasePoint}" for="event-type-${lowerCasePoint}-1">${point}</label>
    </div>`;
  }
  return list;
};

const createDestinationNamesInTemplate = () => {
  const destinationNames = getDestinationNames();
  let list = '';
  for (const name of destinationNames) {
    list += `<option value="${name}"></option>`;
  }
  return list;
};

const checkEntry = (value, entries) => {
  if (entries === undefined) { return false; }
  return Boolean(entries.find(({ title }) => title === value));
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

const createDescriptionOfPointInTemplate = (description) => `<p class="event__destination-description">${description}</p>`;

const createListOfPicturesInTemplate = (pictures) => {
  let list = '';
  for (const picture of pictures) {
    list += `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
  }
  return list;
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

export default class CreateOrEditEvent {
  constructor(point) {
    this._point = point;
    this._element = null;
  }

  getTemplate() {
    let basePrice, dateFrom, dateTo, destination, offers, type, name;

    if (this._point === undefined) {
      type = getRoutePointTypes()[0];
      name = getDestinationNames()[0];
      dateFrom = dateTo = new Date();
      basePrice = '';
      destination = getDestinations().find((item) => item.name === name);
    } else {
      ({ basePrice, dateFrom, dateTo, destination, offers, type } = this._point);
      ({ name } = destination);
    }

    return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
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
                  <button class="event__reset-btn" type="reset">Delete</button>
                  ${this._point !== undefined ? `
                        <button button class="event__rollup-btn" type = "button" >
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

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
