
export const createEmptyList = (filter) => {
  let message = '';
  switch (filter) {
    case 'Everthing':
      message = 'Click New Event to create your first point';
      break;
    case 'Past':
      message = 'There are no past events now';
      break;
    case 'Future':
      message = 'There are no future events now';
      break;
  }
  return `<p class="trip-events__msg">${message}</p>`;
};
