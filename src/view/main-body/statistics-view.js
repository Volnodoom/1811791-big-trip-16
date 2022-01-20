import Abstract from '../abstract';

const createStatisticTemplate = () => (
  `<section class="statistics">
  <h2>Trip statistics</h2>

  <!-- Пример диаграмм -->
  <img src="img/big-trip-stats-markup.png" alt="Пример диаграмм">

  <div class="statistics__item">
    <canvas class="statistics__chart" id="money" width="900"></canvas>
  </div>

  <div class="statistics__item">
    <canvas class="statistics__chart" id="type" width="900"></canvas>
  </div>

  <div class="statistics__item">
    <canvas class="statistics__chart" id="time" width="900"></canvas>
  </div>
</section>`
);

export default class StatisticsView extends Abstract {
  #points = [];

  constructor (points) {
    super();

    this.#points = points;
  }

  get template() {
    return createStatisticTemplate();
  }

}

