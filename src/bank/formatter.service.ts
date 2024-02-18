import { BadRequestException, Injectable } from '@nestjs/common';
import { Bank } from './schemas/bank.schema';
import { Bar, ScatterVector, scatterSeries } from './interfaces';
import { BankTable } from './interfaces/raw.interface';
import { FiltersService } from 'src/filters/filters.service';

@Injectable()
export class FormatterService {
  constructor(private readonly filtersService: FiltersService) {}

  async format(method: string, data: Bank[], flow?: string, count?: number) {
    switch (method) {
      case 'bar':
        return this.bar(data, flow);
      case 'scatter':
        return this.scatter(data);
      case 'custom':
        return new Array(...new Set(data.map((e) => e.account.category)));
      case 'table':
        const filters = await this.filtersService.findOne();
        return { banks: this.table(data), count, filters };
      case 'raw':
        return data;
      default:
        throw new BadRequestException('Wrong formatting method.');
    }
  }

  private table(data: Bank[]): BankTable[] {
    const tableValues: BankTable[] = data.map((e) => ({
      _id: e._id,
      category: e.category ? e.category : 'Others',
      accountCategory: e.account.category,
      merchantName: e.merchant.name,
      amount: e.amount,
      type: e.type,
      status: e.status,
      balance: e.balance,
      valueDate: e.value_date,
    }));

    return tableValues;
  }

  private scatter(data: Bank[]) {
    const names = new Array(...new Set(data.map((e) => e.category)));
    const series = this.scatterSeries(names);

    names.forEach((category) => {
      const temp: ScatterVector[] = [];
      data.forEach((e) => {
        if (e.category === category) {
          temp.push([new Date(e.value_date).getTime(), e.amount]);
        }
      });

      const filtered = series.filter((e) =>
        category ? e.name === category : e.name === 'Others',
      )[0];

      filtered.data = temp;
    });

    return series;
  }

  private bar(data: Bank[], flow = 'OUTFLOW'): Bar {
    const names = new Array(...new Set(data.map((e) => e.category)));
    const dates = new Array(...new Set(data.map((e) => e.value_date)));
    const sortedDates = this.sortDates(dates);

    const series = names.map((name) => {
      const amountsByIndex: number[] = new Array(sortedDates.length).fill(0);
      data
        .filter((e) => e.category === name && e.type === flow && e.amount > 0)
        .map(({ value_date, amount }) => {
          const dateIndex = sortedDates.indexOf(value_date);
          amountsByIndex[dateIndex] = amountsByIndex[dateIndex] += amount * 100;
        });

      const amountFloats = amountsByIndex.map((e) => (e > 0 ? e / 100 : null));
      return {
        name: name ? name : 'Others',
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
        categories: sortedDates,
      },
      yAxis: {
        min: 0,
        title: { text: 'Expenses' },
      },
      plotOptions: {
        bar: {
          pointWidth: 20,
        },
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

  private scatterSeries(categories: string[]): scatterSeries[] {
    const symbols = [
      'Circle',
      'Square',
      'Diamond',
      'Triangle',
      'Triangle-down',
      'Hexagon',
      'Octagon',
      'Star',
      'Cross',
      'X-mark',
    ];

    const data = categories.map((category) => {
      const symbol = Math.floor(Math.random() * symbols.length);
      return {
        name: category ? category : 'Others',
        id: category ? category.toLowerCase() : 'others',
        marker: {
          symbol: symbols[symbol],
        },
      };
    });

    return data;
  }

  private sortDates(data: string[]) {
    const sorted = data.sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime(),
    );

    return sorted;
  }
}
