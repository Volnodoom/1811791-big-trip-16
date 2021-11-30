import { getRandomInteger } from '../utils';

const generateDestinationDescription = () => {
  const descLength = getRandomInteger(1, 5);

  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.',
  ];

  return descriptions.slice(descLength).join(' ');
};

const generateName = () => {
  const names = [
    'Geneva', 'Amsterdam', 'Chamonix', 'Paris', 'Praga', 'Munchen', 'Paris', 'London', 'Rome',
  ];

  const randomIndex = getRandomInteger(0, names.length - 1);

  return names[randomIndex];
};

const generatePictureDescription = () => {
  const descriptions = [
    'Beatiful place.',
    'Very, very lovely place',
    'Nice picture',
  ];

  return descriptions[getRandomInteger(0, 2)];
};

const generatePicture = () => ({
  src: `http://picsum.photos/248/152?r=${getRandomInteger(1, 10)}`,
  description: generatePictureDescription(),
});

export const generateDestination = () => {
  const picturesCount = getRandomInteger(0, 3);

  return {
    description: generateDestinationDescription(),
    name: generateName(),
    pictures: new Array(picturesCount).fill().map(generatePicture),
  };
};

