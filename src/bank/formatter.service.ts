import { BadRequestException, Injectable } from '@nestjs/common';
import { Bank } from './schemas/bank.schema';
import { Bar, ScatterVector, scatterSeries } from './interfaces';
import { BankTable } from './interfaces/raw.interface';
import { FiltersService } from 'src/filters/filters.service';

@Injectable()
export class FormatterService {
  constructor(private readonly filtersService: FiltersService) {}

  async format(
    method: string,
    data: Bank[],
    month?: string,
    flow?: string,
    count?: number,
  ) {
    switch (method) {
      case 'bar':
        return this.bar(data, flow, month);
      case 'scatter':
        return this.scatter(data, month);
      case 'custom':
        return new Array(...new Set(data.map((e) => e.account.category)));
      case 'table':
        const filters = await this.filtersService.findOne();
        filters.valueDate = this.sortDates(filters.valueDate);
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

  private scatter(data: Bank[], month?: string) {
    const names = new Array(...new Set(data.map((e) => e.category)));
    const series = this.scatterSeries(names);

    names.forEach((category) => {
      const temp: ScatterVector[] = [];
      data.forEach((e) => {
        if (e.category === category) {
          let date: number;

          if (!month) date = new Date(e.value_date).getTime();
          else date = new Date(this.monthlyDate(e.value_date)).getTime();

          const existingIndex = temp.findIndex(
            ([existingDate]) => existingDate === date,
          );

          if (existingIndex !== -1) {
            const existingAmount = temp[existingIndex][1];
            const newAmount = (existingAmount * 100 + e.amount * 100) / 100;
            temp[existingIndex][1] = newAmount;
          } else {
            temp.push([date, e.amount]);
          }
        }
      });

      const filtered = series.filter((e) =>
        category ? e.name === category : e.name === 'Others',
      )[0];

      filtered.data = temp;
    });

    return series;
  }

  private bar(data: Bank[], flow = 'OUTFLOW', month?: string): Bar {
    const names = new Array(...new Set(data.map((e) => e.category)));
    let dates: string[];

    if (!month) {
      dates = new Array(...new Set(data.map((e) => e.value_date)));
    } else
      dates = new Array(
        ...new Set(data.map((e) => this.monthlyDate(e.value_date))),
      );

    const sortedDates = this.sortDates(dates);

    const series = names.map((name) => {
      const amountsByIndex: number[] = new Array(sortedDates.length).fill(0);
      data
        .filter((e) => e.category === name && e.type === flow && e.amount > 0)
        .map(({ value_date, amount }) => {
          let dateIndex: number;
          if (!month) dateIndex = sortedDates.indexOf(value_date);
          else dateIndex = sortedDates.indexOf(this.monthlyDate(value_date));
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

  private monthlyDate(date?: string) {
    return date?.split('-').slice(0, 2).join('-');
  }
}
