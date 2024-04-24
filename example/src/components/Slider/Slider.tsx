import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import CommunitySlider, {SliderProps} from '@react-native-community/slider';

interface ISliderProps
  extends Omit<
    SliderProps,
    | 'maximumTrackTintColor'
    | 'thumbTintColor'
    | 'minimumTrackTintColor'
    | 'style'
  > {
  label: string;
}

export const Slider = ({label, ...sliderProps}: ISliderProps) => {
  return (
    <View style={styles.wrapper}>
      <Text>{label}</Text>
      <CommunitySlider
        {...sliderProps}
        style={styles.slider}
        maximumTrackTintColor="#000000"
        thumbTintColor="rgba(98, 126, 234, 1)"
        minimumTrackTintColor="rgba(98, 126, 234, 1)"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  slider: {
    width: 150,
    height: 20,
  },
  wrapper: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default Slider;
