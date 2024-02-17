import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bank } from './schemas/bank.schema';
import { Model } from 'mongoose';
import { Bar } from './interfaces';

@Injectable()
export class FormatterService {
  constructor(
    @InjectModel(Bank.name) private readonly bankModel: Model<Bank>,
  ) {}

  format(method: string, data: Bank[], flow?: string) {
    switch (method) {
      case 'bar':
        return this.bar(data, flow);
      case 'raw':
        // return new Array(...new Set(data.map((e) => e.account.type)));
        return data;
      default:
        throw new BadRequestException('Wrong formatting method.');
    }
  }

  private bar(data: Bank[], flow = 'OUTFLOW'): Bar {
    const names = new Array(...new Set(data.map((e) => e.category)));
    const dates = new Array(...new Set(data.map((e) => e.value_date)));
    const series = names.map((name) => {
      const amountsByIndex = new Array(dates.length).fill(0);
      data
        .filter((e) => e.category === name && e.type === flow)
        .map(({ value_date, amount }) => {
          const dateIndex = dates.indexOf(value_date);
          amountsByIndex[dateIndex] = amountsByIndex[dateIndex] += amount * 100;
        });

      const amountFloats = amountsByIndex.map((e) => (e > 0 ? e / 100 : e));
      return {
        name,
        data: amountFloats,
      };
    });

    const bar: Bar = {
      chart: { type: 'bar' },
      title: {
        text:
          flow === 'OUTFLOW' ? 'Expenses by category' : 'Incomes by category',
      },
      xAxis: {
        categories: new Array(...new Set(data.map((e) => e.value_date))),
      },
      yAxis: {
        min: 0,
        title: { text: 'Expenses' },
      },
      plotOptions: {
        series: {
          stacking: 'normal',
          dataLabels: { enabled: true },
        },
      },
      legend: { reversed: true },
      series,
    };

    return bar;
  }
}

// const series = [
//   {
//     name: 'Basketball',
//     id: 'basketball',
//     marker: {
//       symbol: 'circle',
//     },
//   },
//   {
//     name: 'Triathlon',
//     id: 'triathlon',
//     marker: {
//       symbol: 'triangle',
//     },
//   },
//   {
//     name: 'Volleyball',
//     id: 'volleyball',
//     marker: {
//       symbol: 'square',
//     },
//   },
// ];

// async function getData() {
//   const response = await fetch(
//     'https://www.highcharts.com/samples/data/olympic2012.json',
//   );
//   return response.json();
// }

// Highcharts.setOptions({
//   colors: ['rgba(5,141,199,0.5)', 'rgba(80,180,50,0.5)', 'rgba(237,86,27,0.5)']
// });

// Los gastos son los colores (sports)
// X axis serían las fechas (height)
// Y axis sería la cantidad gastada (weight)
// Sí, Jalu. Yo sé que puse que el X axis es height,
// pero en el gráfico de ejemplo está así.
// A mí también me da TOC, no es mi culpa.

// getData().then(data => {
//   const getData = sportName => {
//       const temp = [];
//       data.forEach(elm => {
//           if (elm.sport === sportName && elm.weight > 0 && elm.height > 0) {
//               temp.push([elm.height, elm.weight]);
//           }
//       });
//       return temp;
//   };
//   series.forEach(s => {
//       s.data = getData(s.id);
//   });

//   Highcharts.chart('container', {
//       chart: {
//           type: 'scatter',
//           zoomType: 'xy'
//       },
//       title: {
//           text: 'Olympics athletes by height and weight',
//           align: 'left'
//       },
//       subtitle: {
//           text:
//         'Source: <a href="https://www.theguardian.com/sport/datablog/2012/aug/07/olympics-2012-athletes-age-weight-height">The Guardian</a>',
//           align: 'left'
//       },
//       xAxis: {
//           title: {
//               text: 'Height'
//           },
//           labels: {
//               format: '{value} m'
//           },
//           startOnTick: true,
//           endOnTick: true,
//           showLastLabel: true
//       },
//       yAxis: {
//           title: {
//               text: 'Weight'
//           },
//           labels: {
//               format: '{value} kg'
//           }
//       },
//       legend: {
//           enabled: true
//       },
//       plotOptions: {
//           scatter: {
//               marker: {
//                   radius: 2.5,
//                   symbol: 'circle',
//                   states: {
//                       hover: {
//                           enabled: true,
//                           lineColor: 'rgb(100,100,100)'
//                       }
//                   }
//               },
//               states: {
//                   hover: {
//                       marker: {
//                           enabled: false
//                       }
//                   }
//               },
//               jitter: {
//                   x: 0.005
//               }
//           }
//       },
//       tooltip: {
//           pointFormat: 'Height: {point.x} m <br/> Weight: {point.y} kg'
//       },
//       series
//   });
// }
