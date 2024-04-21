import React, {useReducer, useState} from 'react';
import {Button, Dimensions, SafeAreaView, StyleSheet} from 'react-native';

import {SharedValue} from 'react-native-reanimated';
import {Circle, GradientProps} from '@shopify/react-native-skia';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  ILeftRightValue,
  ILineChartGridConfig,
  IMinMaxValue,
  ITopBottomValue,
  LineChart,
} from 'react-native-linechart';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import Slider from '@react-native-community/slider';

import {ColorPicker, useColorPickerRef} from './components';
import {data} from './data';

const DEFAULT_HEIGHT = 345;

const AddonExample = ({
  x,
  y,
}: {
  x: SharedValue<number>;
  y: SharedValue<number>;
}) => {
  return <Circle cx={x} cy={y} r={5} color="red" />;
};

const point = {
  value: data[10]?.value ?? 0,
  timestamp: data[10]?.timestamp ?? 0,
};

interface ILineChartConfigState {
  height: number;
  width: number;

  hLinesNumber: number;
  hLinesOffset: number;
  vLinesRange: IMinMaxValue;

  labelColor: string;
  labelSize: number;
  timestampLabelOffset: ITopBottomValue;
  valueLabelOffset: ILeftRightValue;

  lineColors: GradientProps['colors'];

  grid: ILineChartGridConfig;
}

const initialConfig: ILineChartConfigState = {
  width: Dimensions.get('window').width,
  height: DEFAULT_HEIGHT,
  hLinesNumber: 3,
  hLinesOffset: 20,
  vLinesRange: {min: 4, max: 6},
  labelSize: 9,
  timestampLabelOffset: {top: 7, bottom: 10}, // 4 + 3, 7 + 3 to compensate line height
  lineColors: ['rgba(98, 126, 234, 1)', 'rgba(133, 141, 204, 1)'],
  grid: {lineColor: '#E4E4E5', lineWidth: 0.5},
  labelColor: '#8A8B90',
  valueLabelOffset: {left: 8, right: 8},
};

enum ConfigActionTypesEnum {
  Width,
  Height,
  HLinesNumber,
  HLinesOffset,
  VLinesRange,
  LineColors,
  GridLineColor,
  GridLineSize,
  LabelColor,
}

type ConfigAction =
  | {
      type: ConfigActionTypesEnum.Width;
      payload: number;
    }
  | {
      type: ConfigActionTypesEnum.Height;
      payload: number;
    }
  | {
      type: ConfigActionTypesEnum.GridLineColor;
      payload: string;
    }
  | {
      type: ConfigActionTypesEnum.LabelColor;
      payload: string;
    };

const configReducer = (
  state: ILineChartConfigState,
  action: ConfigAction,
): ILineChartConfigState => {
  switch (action.type) {
    case ConfigActionTypesEnum.Width:
      return {...state, width: action.payload};
    case ConfigActionTypesEnum.Height:
      return {...state, height: action.payload};
    case ConfigActionTypesEnum.GridLineColor:
      return {...state, grid: {...state.grid, lineColor: action.payload}};
    case ConfigActionTypesEnum.LabelColor:
      return {...state, labelColor: action.payload};
    default:
      return state;
  }
};

type ColorPickerTypes = 'gridLine' | 'labelColor' | 'lineColor';

function App(): React.JSX.Element {
  const [config, dispatch] = useReducer(configReducer, initialConfig);
  const [colorPickerType, setColorPickerType] =
    useState<ColorPickerTypes>('gridLine');

  const colorPickerRef = useColorPickerRef();

  const handlePickColor = (payload: string) => {
    switch (colorPickerType) {
      case 'gridLine':
        dispatch({type: ConfigActionTypesEnum.GridLineColor, payload});
        break;
      case 'labelColor':
        dispatch({type: ConfigActionTypesEnum.LabelColor, payload});
        break;
    }
  };

  return (
    <GestureHandlerRootView style={styles.handlerWrapper}>
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.wrapper}>
          <LineChart
            data={data}
            config={config}
            addons={[{point, Addon: AddonExample}]}
          />
          <Slider
            style={{width: 200, height: 40}}
            minimumValue={100}
            maximumValue={400}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            onValueChange={value => {
              dispatch({type: ConfigActionTypesEnum.Height, payload: value});
            }}
            value={config.height}
          />
          <Slider
            style={{width: 200, height: 40}}
            minimumValue={100}
            maximumValue={Dimensions.get('window').width}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            onValueChange={value => {
              dispatch({type: ConfigActionTypesEnum.Width, payload: value});
            }}
            value={config.width}
          />
          <Button
            title="Pick grid color"
            onPress={() => {
              colorPickerRef.current?.open(config.grid.lineColor);
              setColorPickerType('gridLine');
            }}
          />
          <Button
            title="Pick label color"
            onPress={() => {
              colorPickerRef.current?.open(config.labelColor);
              setColorPickerType('labelColor');
            }}
          />
          <ColorPicker ref={colorPickerRef} onPickColor={handlePickColor} />
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handlerWrapper: {
    flex: 1,
  },
});

export default App;
