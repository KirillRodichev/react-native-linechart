import {
  processTransform3d,
  SkPath,
  SkPoint,
} from '@shopify/react-native-skia';
import { SharedValue } from 'react-native-reanimated';
import { mapPoint3d } from 'react-native-redash';
import { ICoordinates } from './LineChartViewPort.types';

export const adjustLinePathToViewPort = (
  path: SkPath,
  viewPortCoords: ICoordinates,
  renderCoords: ICoordinates
) => {
  'worklet';
  path.transform(getCoordinatesTransformMatrix(viewPortCoords, renderCoords));
};

export const adjustPointToViewPort = (
  point: SkPoint,
  viewPortCoords: ICoordinates,
  renderCoords: ICoordinates
) => {
  'worklet';

  const [x, y] = mapPoint3d(
    getCoordinatesTransformMatrix(viewPortCoords, renderCoords),
    [point.x, point.y, 1]
  );
  return { x, y };
};

interface IGestureTransform {
  dx: Readonly<SharedValue<number>>;
  scale: Readonly<SharedValue<number>>;
  focalX: Readonly<SharedValue<number>>;
}

const adjustViewPortToLocalExtremes = (
  path: SkPath,
  viewPortCoords: ICoordinates
) => {
  'worklet';
  let min = Infinity;
  let max = -Infinity;

  for (let i = 0; i < path.countPoints(); i++) {
    const point = path.getPoint(i);
    if (point.x >= viewPortCoords.startX && point.x <= viewPortCoords.endX) {
      min = point.y < min ? point.y : min;
      max = point.y > max ? point.y : max;
    }
  }

  return {
    ...viewPortCoords,
    startY: min,
    endY: max,
  };
};

export const gestureTransformViewPort = (
  gestureTransform: IGestureTransform,
  viewPortCoords: ICoordinates,
  renderCoords: ICoordinates,
  path: SkPath
) => {
  'worklet';
  // we might add dy and focalY in future
  const {
    dx, // in dp
    scale,
    focalX,
  } = gestureTransform;
  const matrixRenderRectToViewPort = getCoordinatesTransformMatrix(
    renderCoords,
    viewPortCoords
  );
  const [viewPortDx] = mapPoint3d(matrixRenderRectToViewPort, [dx.value, 0, 1]);
  const [viewPortFocalX] = mapPoint3d(matrixRenderRectToViewPort, [
    focalX.value,
    0,
    1,
  ]);
  const gestureTransformMatrix = processTransform3d([
    { translateX: viewPortDx },
    { translateX: viewPortFocalX },
    { scaleX: scale.value },
    { translateX: -viewPortFocalX },
  ]);
  const [startX, startY] = mapPoint3d(gestureTransformMatrix, [
    viewPortCoords.startX,
    viewPortCoords.startY,
    1,
  ]);
  const [endX, endY] = mapPoint3d(gestureTransformMatrix, [
    viewPortCoords.endX,
    viewPortCoords.endY,
    1,
  ]);
  // todo make adjustToLocalExtremes configurable
  return adjustViewPortToLocalExtremes(path, { startX, startY, endX, endY });
};

/*
Shift coordinates by (-startx, -starty) 
Scale along X-axis with coefficient (newendx-newstartx)/(endx-startx)  (here -80/3)
Scale along Y-axis with coefficient (newendy-newstarty)/(endy-starty)   (here -35)
Shift coordinates by (newstartx, newstarty) 
 */
const getCoordinatesTransformMatrix = (
  fromCoordinates: ICoordinates,
  toCoordinates: ICoordinates
) =>
  processTransform3d([
    { translateX: -fromCoordinates.startX },
    { translateY: -fromCoordinates.startY },
    {
      scaleX:
        (toCoordinates.endX - toCoordinates.startX) /
        (fromCoordinates.endX - fromCoordinates.startX),
    },
    {
      scaleY:
        (toCoordinates.endY - toCoordinates.startY) /
        (fromCoordinates.endY - fromCoordinates.startY),
    },

    { translateX: toCoordinates.startX },
    { translateY: toCoordinates.startY },
  ]);
