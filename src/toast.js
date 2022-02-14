import { TOAST_SHOW_TIME } from './const';
import { createElement } from './render';

const getToastTemplate = (message) => `
  <div class="toast">
    <p class="toast__text">${message}</p>
  </div>
`;

const toast = (message) => {
  const template = getToastTemplate(message);
  const toastNode = createElement(template);
  document.body.appendChild(toastNode);

  setTimeout(() => {
    toastNode.remove();
  }, TOAST_SHOW_TIME);
};

export {toast};
