import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { purple } from '../utils/color';

const TextButton = ({ children, onPress, style = {} }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.reset, style]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  reset: {
    textAlign: 'center',
    color: purple,
    fontWeight: 'bold',
  },
});

export default TextButton;
