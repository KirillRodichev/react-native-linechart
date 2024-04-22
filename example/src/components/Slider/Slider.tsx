import React from 'react';
import {StyleSheet, Text} from 'react-native';

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
    <>
      <Text>{label}</Text>
      <CommunitySlider
        {...sliderProps}
        style={styles.slider}
        maximumTrackTintColor="#000000"
        thumbTintColor="rgba(98, 126, 234, 1)"
        minimumTrackTintColor="rgba(98, 126, 234, 1)"
      />
    </>
  );
};

const styles = StyleSheet.create({
  slider: {
    width: 200,
    height: 20,
  },
});

export default Slider;
