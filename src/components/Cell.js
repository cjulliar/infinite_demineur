import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';

const Cell = memo(({ value, onPress, onLongPress }) => {
  const getCellContent = () => {
    if (!value.isRevealed && !value.isFlagged) return '';
    if (value.isFlagged) return '🚩';
    if (value.isMine) return '💣';
    return value.neighborCount > 0 ? value.neighborCount : '';
  };

  const cellStyle = [
    styles.cell,
    value.isRevealed && (value.isMine ? styles.mineCell : styles.revealedCell)
  ];

  return (
    <TouchableOpacity
      style={cellStyle}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Text style={styles.cellText}>{getCellContent()}</Text>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // Optimisation du re-rendu
  return (
    prevProps.value.isRevealed === nextProps.value.isRevealed &&
    prevProps.value.isFlagged === nextProps.value.isFlagged
  );
});

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