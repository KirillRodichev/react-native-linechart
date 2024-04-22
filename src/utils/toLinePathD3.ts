import { curveBasis, line } from 'd3-shape';
import { Skia } from '@shopify/react-native-skia';

import { ILinePoint } from '../LineChart.types';

export const toLinePathD3 = (data: ILinePoint[]) => {
  const curvedLine = line<ILinePoint>()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(curveBasis)(data);

  return Skia.Path.MakeFromSVGString(curvedLine!)!;
};
