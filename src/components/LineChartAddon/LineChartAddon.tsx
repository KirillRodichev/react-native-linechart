import React from 'react';

import { ILineChartAddon } from '../../LineChart.types';
import { usePointToRenderCoords } from '../LineChartViewPort/hooks/usePointToRenderCoords';
import { useDerivedValue } from 'react-native-reanimated';

interface ILineChartAddonProps {
  addon: ILineChartAddon;
}

export const LineChartAddon = ({
  addon: { point, Addon },
}: ILineChartAddonProps) => {
  const renderPoint = usePointToRenderCoords({
    point: {
      x: point.timestamp,
      y: point.value,
    },
  });

  const x = useDerivedValue(() => renderPoint.value.x);
  const y = useDerivedValue(() => renderPoint.value.y);

  return <Addon x={x} y={y} />;
};

export default LineChartAddon;
