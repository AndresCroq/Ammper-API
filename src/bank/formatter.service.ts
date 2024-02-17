import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bank } from './schemas/bank.schema';
import { Model } from 'mongoose';
import { Bar, ScatterVector, scatterSeries } from './interfaces';
import { BankTable } from './interfaces/raw.interface';

@Injectable()
export class FormatterService {
  constructor(
    @InjectModel(Bank.name) private readonly bankModel: Model<Bank>,
  ) {}

  format(method: string, data: Bank[], flow?: string) {
    switch (method) {
      case 'bar':
        return this.bar(data, flow);
      case 'scatter':
        return this.scatter(data, flow);
      case 'custom':
        return new Array(...new Set(data.map((e) => e.account.category)));
      case 'table':
        return this.table(data);
      case 'raw':
        return data;
      default:
        throw new BadRequestException('Wrong formatting method.');
    }
  }

  private table(data: Bank[]): BankTable[] {
    const tableValues: BankTable[] = data.map((e) => ({
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

  private scatter(data: Bank[], flow: string) {
    const names = new Array(...new Set(data.map((e) => e.category)));
    const series = this.scatterSeries(names);

    names.forEach((category) => {
      const temp: ScatterVector[] = [];
      data.forEach((e) => {
        if (e.category === category && e.type === flow) {
          temp.push([e.value_date, e.amount]);
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
    const series = names.map((name) => {
      const amountsByIndex = new Array(dates.length).fill(0);
      data
        .filter((e) => e.category === name && e.type === flow && e.amount > 0)
        .map(({ value_date, amount }) => {
          const dateIndex = dates.indexOf(value_date);
          amountsByIndex[dateIndex] = amountsByIndex[dateIndex] += amount * 100;
        });

      const amountFloats = amountsByIndex.map((e) => (e > 0 ? e / 100 : e));
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
}
