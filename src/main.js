import { createSiteMenuTemplate } from './view/site-menu.js';

const siteNavigationElement = document.querySelector('.trip-controls__navigation');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(siteNavigationElement, createSiteMenuTemplate(), 'beforeend');
