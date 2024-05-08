import React, { createContext, PropsWithChildren } from 'react';
import { SharedValue } from 'react-native-reanimated';
import { ICoordinates } from './LineChartViewPort.types';

interface ILineChartViewPortContextValue {
  viewPortCoords: SharedValue<ICoordinates>;
  renderCoords: ICoordinates;
}

export const LineChartViewPortContext =
  createContext<ILineChartViewPortContextValue>({
    viewPortCoords: {
      value: {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
      },
      addListener: () => {},
      removeListener: () => {},
      modify: () => {},
    },
    renderCoords: {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
    },
  });

export const LineChartViewPortProvider = ({
  children,
  viewPortCoords,
  renderCoords,
}: PropsWithChildren<ILineChartViewPortContextValue>) => (
  <LineChartViewPortContext.Provider value={{ viewPortCoords, renderCoords }}>
    {children}
  </LineChartViewPortContext.Provider>
);
