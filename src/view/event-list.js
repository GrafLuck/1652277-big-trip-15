import AbstractView from '@view/abstract.js';

export default class EventList extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return `<ul class="trip-events__list">
            </ul>`;
  }
}
