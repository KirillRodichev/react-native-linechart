import React, {PropsWithChildren} from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';

interface ICardProps {
  title: string;
  cardStyle?: StyleProp<ViewStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
}

export const Card = ({
  title,
  cardStyle,
  wrapperStyle,
  children,
}: PropsWithChildren<ICardProps>) => {
  return (
    <View style={[styles.cardWrapper, wrapperStyle]}>
      <Text style={styles.title}>{title}</Text>
      <View style={[styles.card, cardStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cardWrapper: {
    gap: 8,
    width: '100%',
    paddingTop: 16,
  },
  title: {
    textTransform: 'uppercase',
  },
});

export default Card;
