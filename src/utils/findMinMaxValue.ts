import { IDataPoint } from '../LineChart.types';

// FixMe: remove ignores
export const findMinMaxValue = (data: IDataPoint[]) => {
  // @ts-ignore
  let min = data[0].value;
  // @ts-ignore
  let max = data[0].value;

  for (let i = 1; i < data.length; i++) {
    // @ts-ignore
    if (data[i].value < min) {
      min = data[i]?.value ?? 0;
    }
    // @ts-ignore
    if (data[i]?.value > max) {
      max = data[i]?.value ?? 0;
    }
  }
  return { min, max };
};
