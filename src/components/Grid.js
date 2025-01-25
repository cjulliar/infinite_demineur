import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, Alert, ScrollView } from 'react-native';
import Cell from './Cell';
import { createGrid, revealEmptyCells } from '../utils/gameLogic';

const Grid = () => {
  const totalRows = 20;
  const totalCols = 20;
  const mines = 40;

  const [grid, setGrid] = useState(() => createGrid(totalRows, totalCols, mines));
  const [gameOver, setGameOver] = useState(false);

  const handlePress = useCallback((row, col) => {
    if (gameOver || grid[row][col].isFlagged) return;

    if (grid[row][col].isMine) {
      setGrid(prev => prev.map(row => row.map(cell => ({
        ...cell,
        isRevealed: true
      }))));
      setGameOver(true);
      Alert.alert('Game Over', 'Vous avez touché une mine !', [
        {text: 'Rejouer', onPress: () => {
          setGrid(createGrid(totalRows, totalCols, mines));
          setGameOver(false);
        }}
      ]);
      return;
    }

    setGrid(prev => revealEmptyCells([...prev], row, col));
  }, [gameOver]);

  const handleLongPress = useCallback((row, col) => {
    if (gameOver || grid[row][col].isRevealed) return;

    setGrid(prev => {
      const newGrid = [...prev];
      newGrid[row] = [...newGrid[row]];
      newGrid[row][col] = {
        ...newGrid[row][col],
        isFlagged: !newGrid[row][col].isFlagged
      };
      return newGrid;
    });
  }, [gameOver]);

  const gridContent = useMemo(() => (
    grid.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            value={cell}
            onPress={() => handlePress(rowIndex, colIndex)}
            onLongPress={() => handleLongPress(rowIndex, colIndex)}
          />
        ))}
      </View>
    ))
  ), [grid, handlePress, handleLongPress]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Démineur Infini</Text>
      <ScrollView style={styles.scrollContainer} horizontal>
        <ScrollView>
          <View style={styles.gridContainer}>
            {gridContent}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  gridContainer: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 24,
    marginVertical: 20,
    fontWeight: 'bold',
  },
});

export default React.memo(Grid); 