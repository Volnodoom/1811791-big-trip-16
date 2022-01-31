import Abstract from '../abstract';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartColor, ChartNames, EventDescription, STATISTICS_BAR_HEIGHT } from '../../const';
import { calculateFrequencyOfType, calculateTotalMoneyForEventType, calculateTotalTimeForEventType, getDurationOfOnePointEvent } from '../../utils';

const getArrayOfTravelTypes = () => Object.values(EventDescription).map((element) =>[element.lowCaseWord, element.statisticsLabele]);

const insertDataAccordingToChartNamex = (chartName, travelType, points) => {
  switch (chartName) {
    case ChartNames.MONEY:
      return calculateTotalMoneyForEventType(travelType, points);
    case ChartNames.TYPE:
      return calculateFrequencyOfType(travelType, points);
    case ChartNames.TIME:
      return calculateTotalTimeForEventType(travelType, points);
    default:
      throw new Error('We could not find such chart name in our DataBase');
  }
};

const makeArrayDataWithoutZeroValues = (chartName, points) => getArrayOfTravelTypes()
  .map((travelType) => [travelType[1], insertDataAccordingToChartNamex(chartName, travelType[0], points)])
  .filter((line) => line[1] !== 0)
  .sort((valueA, valueB) => valueB[1] - valueA[1]);

const getValuesOnSideBar = (chartName) => {
  switch (chartName) {
    case ChartNames.MONEY:
      return (val) => `€ ${val}`;
    case ChartNames.TYPE:
      return (val) => `${val}x`;
    case ChartNames.TIME:
      return (val) => `${getDurationOfOnePointEvent(val)}`;
    default:
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
      backgroundColor: ChartColor.WHITE,
      hoverBackgroundColor: ChartColor.WHITE,
      anchor: 'start',
      barThickness: 30,
      minBarLength: 120,
    }],
  },
  options: {
    responsive: false,
    plugins: {
      datalabels: {
        font: {
          size: 13,
        },
        color: ChartColor.BLACK,
        anchor: 'end',
        align: 'start',
        formatter: getValuesOnSideBar(chartName),
      },
    },
    title: {
      display: true,
      text: chartName,
      fontColor: ChartColor.BLACK,
      fontSize: 23,
      position: 'left',
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: ChartColor.BLACK,
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

    moneyCtx.height = STATISTICS_BAR_HEIGHT;
    typeCtx.height = STATISTICS_BAR_HEIGHT;
    timeCtx.height = STATISTICS_BAR_HEIGHT;

    renderChart(moneyCtx, ChartNames.MONEY, this.#points);
    renderChart(typeCtx, ChartNames.TYPE, this.#points);
    renderChart(timeCtx, ChartNames.TIME, this.#points);
  }

}

