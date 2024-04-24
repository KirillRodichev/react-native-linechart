import React, {
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Button, StyleSheet, View} from 'react-native';

import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import ReanimatedColorPicker, {
  HueSlider,
  OpacitySlider,
  Panel1,
  Preview,
} from 'reanimated-color-picker';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';

const PICKER_SHEET_HEIGHT = 400;

interface IColorPickerHandle {
  open: (value: string) => void;
}

interface IColorPickerProps {
  onPickColor: (color: string) => void;
}

export const useColorPickerRef = () => useRef<IColorPickerHandle>(null);

const ColorPickerBase: ForwardRefRenderFunction<
  IColorPickerHandle,
  IColorPickerProps
> = ({onPickColor}, forwardedRef) => {
  const [value, setValue] = useState('#000000');
  const ref = useRef<BottomSheetModal>(null);

  useImperativeHandle(forwardedRef, () => ({
    open: v => {
      ref.current?.present();
      setValue(v);
    },
  }));

  return (
    <BottomSheetModal
      ref={ref}
      detached
      bottomInset={24}
      enableDynamicSizing
      backdropComponent={CustomBackdrop}
      style={styles.modal}>
      <BottomSheetView style={styles.sheetView}>
        <View>
          <ReanimatedColorPicker
            value={value}
            style={styles.colorPicker}
            onComplete={({hex}) => onPickColor(hex)}>
            <Preview />
            <Panel1 />
            <HueSlider />
            <OpacitySlider />
          </ReanimatedColorPicker>
        </View>
        <Button title="Ok" onPress={() => ref.current?.dismiss()} />
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const CustomBackdrop = ({animatedIndex, style}: BottomSheetBackdropProps) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [-1, 0], [0, 0.4], 'clamp'),
  }));

  const containerStyle = useMemo(
    () => [style, {backgroundColor: '#000000'}, containerAnimatedStyle],
    [style, containerAnimatedStyle],
  );

  return <Animated.View style={containerStyle} />;
};

const styles = StyleSheet.create({
  colorPicker: {
    gap: 16,
  },
  sheetView: {
    height: PICKER_SHEET_HEIGHT,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  modal: {
    marginHorizontal: 16,
  },
});

export const ColorPicker = forwardRef(ColorPickerBase);

export default ColorPicker;
