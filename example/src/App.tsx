import React from 'react';
import {Dimensions, SafeAreaView, StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SharedValue} from 'react-native-reanimated';
import {Circle} from '@shopify/react-native-skia';

import {LineChart} from 'react-native-linechart';

import {data} from './data';

const DEFAULT_HEIGHT = 345;

const getLineChartConfig = (wrapperHeight = DEFAULT_HEIGHT) => {
  return {
    width: Dimensions.get('window').width,
    height: wrapperHeight,
    hLinesNumber: 3,
    hLinesOffset: 20,
    vLinesRange: {min: 4, max: 6},
    labelSize: 9,
    timestampLabelOffset: {top: 7, bottom: 10}, // 4 + 3, 7 + 3 to compensate line height
    lineColors: ['rgba(98, 126, 234, 1)', 'rgba(133, 141, 204, 1)'],
    gridColor: '#E4E4E5',
    labelColor: '#8A8B90',
    valueLabelOffset: {left: 8, right: 8},
  };
};

const AddonExample = ({
  x,
  y,
}: {
  x: SharedValue<number>;
  y: SharedValue<number>;
}) => {
  return <Circle cx={x} cy={y} r={5} color="red" />;
};

function App(): React.JSX.Element {
  const chartConfig = getLineChartConfig();

  return (
    <GestureHandlerRootView style={styles.handlerWrapper}>
      <SafeAreaView style={styles.wrapper}>
        <LineChart
          data={data}
          config={chartConfig}
          addons={[{point: {value: 1, timestamp: 1}, Addon: AddonExample}]}
        />
      </SafeAreaView>
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
