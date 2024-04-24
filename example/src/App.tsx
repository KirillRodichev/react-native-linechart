import React, {useReducer, useState} from 'react';
import {
  Button,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {SharedValue} from 'react-native-reanimated';
import {Circle, GradientProps} from '@shopify/react-native-skia';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  ILeftRightValue,
  ILineChartGridConfig,
  ILineChartLineConfig,
  IMinMaxValue,
  ITopBottomValue,
  LineChart,
} from 'react-native-linechart';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import {ColorPicker, useColorPickerRef, Slider, Card} from './components';
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

  line: ILineChartLineConfig;
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
  line: {
    colors: ['rgba(98, 126, 234, 1)', 'rgba(133, 141, 204, 1)'],
    width: 2,
  },
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
  LineWidth,
  GridLineColor,
  GridLineWidth,
  LabelColor,
  LabelSize,
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
      type: ConfigActionTypesEnum.GridLineWidth;
      payload: number;
    }
  | {
      type: ConfigActionTypesEnum.LabelSize;
      payload: number;
    }
  | {
      type: ConfigActionTypesEnum.LineWidth;
      payload: number;
    }
  | {
      type: ConfigActionTypesEnum.LineColors;
      payload: GradientProps['colors'];
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
    case ConfigActionTypesEnum.GridLineWidth:
      return {...state, grid: {...state.grid, lineWidth: action.payload}};
    case ConfigActionTypesEnum.LabelColor:
      return {...state, labelColor: action.payload};
    case ConfigActionTypesEnum.LabelSize:
      return {...state, labelSize: action.payload};
    case ConfigActionTypesEnum.LineWidth:
      return {...state, line: {...state.line, width: action.payload}};
    case ConfigActionTypesEnum.LineColors:
      return {...state, line: {...state.line, colors: action.payload}};
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
      case 'lineColor':
        dispatch({
          type: ConfigActionTypesEnum.LineColors,
          payload: [...config.line.colors, payload],
        });
        break;
    }
  };

  return (
    <GestureHandlerRootView style={styles.handlerWrapper}>
      <BottomSheetModalProvider>
        <SafeAreaView style={{flex: 1}}>
          <ScrollView contentContainerStyle={styles.wrapper}>
            <LineChart
              data={data}
              config={config}
              addons={[{point, Addon: AddonExample}]}
            />
            <Card title="Size config:" wrapperStyle={styles.cardWrapper}>
              <Slider
                label={`Height: ${config.height}`}
                value={config.height}
                minimumValue={100}
                maximumValue={400}
                onValueChange={value => {
                  dispatch({
                    type: ConfigActionTypesEnum.Height,
                    payload: value,
                  });
                }}
              />
              <Slider
                label={`Width: ${config.width}`}
                value={config.width}
                minimumValue={100}
                maximumValue={Dimensions.get('window').width}
                onValueChange={value => {
                  dispatch({type: ConfigActionTypesEnum.Width, payload: value});
                }}
              />
              <Slider
                label={`Grid line width: ${config.grid.lineWidth}`}
                step={0.5}
                minimumValue={0.5}
                maximumValue={5}
                value={config.grid.lineWidth}
                onValueChange={value => {
                  dispatch({
                    type: ConfigActionTypesEnum.GridLineWidth,
                    payload: value,
                  });
                }}
              />
              <Slider
                label={`Label size: ${config.labelSize}`}
                step={1}
                minimumValue={5}
                maximumValue={15}
                value={config.labelSize}
                onValueChange={value => {
                  dispatch({
                    type: ConfigActionTypesEnum.LabelSize,
                    payload: value,
                  });
                }}
              />
              <Slider
                label={`Line width: ${config.line.width}`}
                step={0.5}
                minimumValue={0.5}
                maximumValue={5}
                value={config.line.width}
                onValueChange={value => {
                  dispatch({
                    type: ConfigActionTypesEnum.LineWidth,
                    payload: value,
                  });
                }}
              />
            </Card>
            <Card
              title="Colors config:"
              cardStyle={styles.colorsCard}
              wrapperStyle={styles.cardWrapper}>
              <Button
                color="#000"
                title="Pick grid color"
                onPress={() => {
                  colorPickerRef.current?.open(config.grid.lineColor);
                  setColorPickerType('gridLine');
                }}
              />
              <Button
                color="#000"
                title="Pick label color"
                onPress={() => {
                  colorPickerRef.current?.open(config.labelColor);
                  setColorPickerType('labelColor');
                }}
              />
              <View style={styles.lineColorsWrapper}>
                <Text>Line colors:</Text>
                <View style={styles.lineColorsPickersWrapper}>
                  <Button
                    title="Remove"
                    color="#000"
                    disabled={config.line.colors.length < 2}
                    onPress={() => {
                      dispatch({
                        type: ConfigActionTypesEnum.LineColors,
                        payload: config.line.colors.slice(0, -1),
                      });
                    }}
                  />
                  <Button
                    title="Add"
                    color="#000"
                    disabled={config.line.colors.length > 5}
                    onPress={() => {
                      colorPickerRef.current?.open('#000');
                      setColorPickerType('lineColor');
                    }}
                  />
                </View>
              </View>
            </Card>
            <ColorPicker ref={colorPickerRef} onPickColor={handlePickColor} />
          </ScrollView>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingBottom: 24,
  },
  handlerWrapper: {
    flex: 1,
  },
  lineColorsWrapper: {
    alignItems: 'center',
  },
  lineColorsPickersWrapper: {
    flexDirection: 'row',
    gap: 8,
  },
  colorsCard: {
    gap: 8,
  },
  cardWrapper: {
    paddingHorizontal: 16,
  },
});

export default App;
