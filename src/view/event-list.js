import AbstractView from '@view/abstract.js';

export default class EventList extends AbstractView {
  getTemplate() {
    return `<ul class="trip-events__list">
            </ul>`;
  }
}
