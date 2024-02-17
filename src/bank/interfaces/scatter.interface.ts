export type ScatterVector = [string, number];

export interface scatterSeries {
  name: string;
  id: string;
  marker: {
    symbol: string;
  };
  data?: ScatterVector[];
}
