import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

const Cell = ({ value, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.cell}
      onPress={onPress}
    />
  );
};

const styles = StyleSheet.create({
  cell: {
    width: 30,
    height: 30,
    backgroundColor: '#ccc',
    borderWidth: 1,
    borderColor: '#999',
  },
});

export default Cell; 