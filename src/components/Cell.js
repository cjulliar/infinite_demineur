import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';

const Cell = ({ value, onPress, onLongPress }) => {
  const getCellContent = () => {
    if (!value.isRevealed && !value.isFlagged) return '';
    if (value.isFlagged) return '🚩';
    if (value.isMine) return '💣';
    return value.neighborCount > 0 ? value.neighborCount : '';
  };

  const getCellStyle = () => {
    if (!value.isRevealed) return styles.cell;
    if (value.isMine) return [styles.cell, styles.mineCell];
    return [styles.cell, styles.revealedCell];
  };

  return (
    <TouchableOpacity
      style={getCellStyle()}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Text style={styles.cellText}>{getCellContent()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: 30,
    height: 30,
    backgroundColor: '#ccc',
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  revealedCell: {
    backgroundColor: '#eee',
  },
  mineCell: {
    backgroundColor: '#ff9999',
  },
  cellText: {
    fontSize: 16,
  },
});

export default Cell; 