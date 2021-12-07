import { EventDescription } from '../../const';
import Abstract from '../abstract';

const createEventTypeListTemplate = () => {
  const getSingleEvent = (eventInfo) => (
    `<div class="event__type-item">

      <input
        id="event-type-${eventInfo.lowCaseWord}-1"
        class="event__type-input  visually-hidden"
        type="radio" name="event-type"
        value="${eventInfo.lowCaseWord}"
        />

      <label class="event__type-label  event__type-label--${eventInfo.lowCaseWord}"
      for="event-type-${eventInfo.lowCaseWord}-1"
      >${eventInfo.capitalLetterWord}</label>

    </div>`
  );

  return `<div class="event__type-list">
  <fieldset class="event__type-group">
    <legend class="visually-hidden">Event type</legend>

    ${Object
    .values(EventDescription)
    .map((description) => getSingleEvent(description))
    .join(' ')}

  </fieldset>
</div>`;
};

export default class EventTypeListView extends Abstract {
  get template() {
    return createEventTypeListTemplate();
  }
}

