import { createElement } from '@/utils.js';
import { Filter } from '@/const.js';

export default class EmptyList {
  constructor(filter) {
    this._filter = filter;
    this._element = null;
  }

  getTemplate() {
    let message = '';
    switch (this._filter) {
      case Filter.EVERYTHING:
        message = 'Click New Event to create your first point';
        break;
      case Filter.PAST:
        message = 'There are no past events now';
        break;
      case Filter.FUTURE:
        message = 'There are no future events now';
        break;
    }
    return `<p class="trip-events__msg">${message}</p>`;
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
