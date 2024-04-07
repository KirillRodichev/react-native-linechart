import * as React from 'react';
import { StyleSheet, View, Platform, Dimensions } from 'react-native'
import { matchFont } from '@shopify/react-native-skia'

import { LineChart } from 'react-native-linechart'

import { data } from './data'

const DEFAULT_HEIGHT = 345
const ADDITIONAL_TOP_OFFSET = 10

const getOHLCChartConfig = (wrapperHeight = DEFAULT_HEIGHT) => {
  const offset = { top: 30 + ADDITIONAL_TOP_OFFSET, bottom: 40 }
  return {
    viewport: {
      zoom: { x: 2, max: 6 },
      offset,
      height:
        wrapperHeight -
        offset.top -
        offset.bottom
    },
  }
}

const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });
const positionLabelFontStyle = {
  fontFamily,
  fontSize: 11,
  fontWeight: "bold",
} as const
const positionLabelFont = matchFont(positionLabelFontStyle);

const gridLabelFontStyle = {
  fontFamily,
  fontSize: 9,
} as const
const gridLabelFont = matchFont(gridLabelFontStyle);

export default function App() {
  const chartConfig = getOHLCChartConfig()
  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        config={{
          width: Dimensions.get('window').width,
          height:
            chartConfig.viewport.height +
            chartConfig.viewport.offset.top +
            chartConfig.viewport.offset.bottom -
            ADDITIONAL_TOP_OFFSET,
          hLinesNumber: 3,
          hLinesOffset: 20,
          vLinesRange: { min: 4, max: 6 },
          labelSize: 9,
          timestampLabelOffset: { top: 7, bottom: 10 }, // 4 + 3, 7 + 3 to compensate line height
          lineColors: ['rgba(98, 126, 234, 1)', 'rgba(133, 141, 204, 1)'],
          gridColor: '#E4E4E5',
          labelColor: '#8A8B90',
          valueLabelOffset: { left: 8, right: 8 },
          fonts: {
            positionLabelFont,
            gridLabelFont,
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
