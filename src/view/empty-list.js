import { Filter } from '@/const.js';
import AbstractView from '@view/abstract.js';

export default class EmptyList extends AbstractView {
  constructor(filter) {
    super();
    this._filter = filter;
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
}
