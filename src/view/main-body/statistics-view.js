import Abstract from '../abstract';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartNames, EventDescription, NOTHING, STATISTICS_BAR_HEIGHT } from '../../const';
import { calculateStatisticsForMoney, calculateStatisticsForTime, calculateStatisticsForType, durationOfOnePointEvent } from '../../utils';

const getArrayOfTravelTypes = () => Object.values(EventDescription).map((element) =>[element.capitalLetterWord, element.statisticsLabele]);

const insertDataAccordingToChartNamex = (chartName, travelType, points) => {
  if (chartName === ChartNames.MONEY) {
    return calculateStatisticsForMoney(travelType, points);
  } else if (chartName === ChartNames.TYPE) {
    return calculateStatisticsForType(travelType, points);
  } else if (chartName === ChartNames.TIME) {
    return calculateStatisticsForTime(travelType, points);
  } else {
    throw new Error('We could not find such chart name in our DataBase');
  }
};

const makeArrayDataWithoutZeroValues = (chartName, points) => getArrayOfTravelTypes()
  .map((travelType) => [travelType[1], insertDataAccordingToChartNamex(chartName, travelType[0], points)])
  .filter((line) => line[1] !== NOTHING)
  .sort((valueA, valueB) => valueB[1] - valueA[1]);

const getValuesOnSideBar = (chartName) => {
  if (chartName === ChartNames.MONEY) {
    return (val) => `€ ${val}`;
  } else if (chartName === ChartNames.TYPE) {
    return (val) => `${val}x`;
  } else if (chartName === ChartNames.TIME) {
    return (val) => `${durationOfOnePointEvent(val)}`;
  } else {
    throw new Error('We could not find such chart name in our DataBase');
  }
};

const renderChart = (typeOfCtx, chartName, points) => new Chart(typeOfCtx, {
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
  data: {
    labels: makeArrayDataWithoutZeroValues(chartName, points).map((line) => line[0]),
    datasets: [{
      data: makeArrayDataWithoutZeroValues(chartName, points).map((line) => line[1]),
      backgroundColor: '#ffffff',
      hoverBackgroundColor: '#ffffff',
      anchor: 'start',
      barThickness: 44,
      minBarLength: 50,
    }],
  },
  options: {
    responsive: false,
    plugins: {
      datalabels: {
        font: {
          size: 13,
        },
        color: '#000000',
        anchor: 'end',
        align: 'start',
        formatter: getValuesOnSideBar(chartName),
      },
    },
    title: {
      display: true,
      text: chartName,
      fontColor: '#000000',
      fontSize: 23,
      position: 'left',
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#000000',
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  },
});


const createStatisticTemplate = () => (
  `<section class="statistics">

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

  #moneyChart = null;
  #typeChart = null;
  #timeChart = null;

  constructor (points) {
    super();

    this.#points = points;

    this.setCharts();
  }

  get template() {
    return createStatisticTemplate();
  }

  setCharts = () => {
    const moneyCtx = this.element.querySelector('#money');
    const typeCtx = this.element.querySelector('#type');
    const timeCtx = this.element.querySelector('#time');

    this.#moneyChart = renderChart(moneyCtx, ChartNames.MONEY, this.#points);
    this.#typeChart = renderChart(typeCtx, ChartNames.TYPE, this.#points);
    this.#timeChart = renderChart(timeCtx, ChartNames.TIME, this.#points);

    moneyCtx.height = STATISTICS_BAR_HEIGHT;
    typeCtx.height = STATISTICS_BAR_HEIGHT;
    timeCtx.height = STATISTICS_BAR_HEIGHT;
  }

}

