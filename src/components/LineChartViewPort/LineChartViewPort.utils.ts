import {
  mapPoint3d,
  processTransform3d,
  SkPath,
  SkPoint,
} from '@shopify/react-native-skia';
import { SharedValue } from 'react-native-reanimated';
import { ICoordinates } from './LineChartViewPort.types';

/*
Shift coordinates by (-startx, -starty) 
Scale along X-axis with coefficient (newendx-newstartx)/(endx-startx)  (here -80/3)
Scale along Y-axis with coefficient (newendy-newstarty)/(endy-starty)   (here -35)
Shift coordinates by (newstartx, newstarty) 
 */
export const getCoordinatesTransformMatrix = (
  fromCoordinates: ICoordinates,
  toCoordinates: ICoordinates
) => {
  'worklet';
  const matrix = processTransform3d([
    { translateX: toCoordinates.startX },
    { translateY: toCoordinates.startY },
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
    { translateX: -fromCoordinates.startX },
    { translateY: -fromCoordinates.startY },
  ]);
  return matrix;
};

export const transformLinePathToRenderCoords = (
  path: SkPath,
  viewPortCoords: ICoordinates,
  renderCoords: ICoordinates
) => {
  'worklet';
  return path.transform(
    getCoordinatesTransformMatrix(viewPortCoords, renderCoords)
  );
};

interface ITransformPointToCoordsParams {
  point: SkPoint;
  fromCoords: ICoordinates;
  toCoords: ICoordinates;
}

export const transformPointToCoords = ({
  point,
  fromCoords,
  toCoords,
}: ITransformPointToCoordsParams) => {
  'worklet';

  const [x, y] = mapPoint3d(
    getCoordinatesTransformMatrix(fromCoords, toCoords),
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
  const scaleX =
    (viewPortCoords.endX - viewPortCoords.startX) /
    (renderCoords.endX - renderCoords.startX);
  const viewPortDx = dx.value * scaleX;
  const [viewPortFocalX] = mapPoint3d(matrixRenderRectToViewPort, [
    focalX.value,
    0,
    1,
  ]);
  console.log('dx, focalX', viewPortDx, viewPortFocalX, dx, focalX);
  const gestureTransformMatrix = processTransform3d([
    { translateX: -viewPortDx },
    { translateX: viewPortFocalX },
    { scaleX: 1 / scale.value },
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
  // return adjustViewPortToLocalExtremes(path, { startX, startY, endX, endY });
  return { startX, startY, endX, endY };
};

const fromCoordinates: ICoordinates = {
  startX: 5,
  startY: 10,
  endX: 10,
  endY: 30,
};

const toCoordinates = {
  startX: -5,
  startY: 5,
  endX: 15,
  endY: 10,
};

const test = () => {
  const matrix = getCoordinatesTransformMatrix(fromCoordinates, toCoordinates);
  console.log('TESTTEST', 'matrix', matrix);
  const [x, y, z] = mapPoint3d(matrix, [5, 20, 1]);
  console.log('TESTTEST', x, y, z);
};

test();
