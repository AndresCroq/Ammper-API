export type ScatterVector = [number, number];

export interface scatterSeries {
  name: string;
  id: string;
  marker: {
    symbol: string;
  };
  data?: ScatterVector[];
}
