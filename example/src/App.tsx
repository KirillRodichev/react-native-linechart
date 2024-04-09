import React from 'react'
import { Dimensions, SafeAreaView, StyleSheet } from 'react-native'

import { LineChart } from 'react-native-linechart'

import { data } from './data'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const DEFAULT_HEIGHT = 345
const ADDITIONAL_TOP_OFFSET = 10

const getOHLCChartConfig = (wrapperHeight = DEFAULT_HEIGHT) => {
  return {
    width: Dimensions.get('window').width,
    height: wrapperHeight - ADDITIONAL_TOP_OFFSET,
    hLinesNumber: 3,
    hLinesOffset: 20,
    vLinesRange: { min: 4, max: 6 },
    labelSize: 9,
    timestampLabelOffset: { top: 7, bottom: 10 }, // 4 + 3, 7 + 3 to compensate line height
    lineColors: ['rgba(98, 126, 234, 1)', 'rgba(133, 141, 204, 1)'],
    gridColor: '#E4E4E5',
    labelColor: '#8A8B90',
    valueLabelOffset: { left: 8, right: 8 },
  }
}

function App(): React.JSX.Element {
  const chartConfig = getOHLCChartConfig()

  return (
    <GestureHandlerRootView style={styles.handlerWrapper}>
      <SafeAreaView style={styles.wrapper}>
        <LineChart
          data={data}
          config={chartConfig}
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
