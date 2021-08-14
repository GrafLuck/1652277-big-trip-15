import AbstractView from '@view/abstract.js';
import { LocationElement } from '@/const';

const render = (container, child, place = LocationElement.BEFOREEND) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  if (child instanceof AbstractView) {
    child = child.getElement();
  }

  if (place === LocationElement.BEFOREEND) {
    container.append(child);
  } else if (place === LocationElement.AFTERBEGIN) {
    container.prepend(child);
  }
};

const create = (template) => {
  const newDiv = document.createElement('div');
  newDiv.innerHTML = template;

  return newDiv.firstChild;
};

const replace = (newChild, oldChild) => {
  if (oldChild instanceof AbstractView) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof AbstractView) {
    newChild = newChild.getElement();
  }

  if (oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  const parent = oldChild.parentElement;

  if (parent === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};

const remove = (component) => {
  if (!(component instanceof AbstractView)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

export { render, create, replace, remove };
