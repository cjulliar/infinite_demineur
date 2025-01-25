import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import Cell from './Cell';
import { createGrid, revealEmptyCells } from '../utils/gameLogic';

const Grid = () => {
  const rows = 12;
  const cols = 12;
  const mines = 20; // Nombre de mines

  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    setGrid(createGrid(rows, cols, mines));
    setGameOver(false);
  };

  const handlePress = (row, col) => {
    if (gameOver || grid[row][col].isFlagged) return;

    if (grid[row][col].isMine) {
      // Perdu !
      const newGrid = grid.map(row => row.map(cell => ({
        ...cell,
        isRevealed: true
      })));
      setGrid(newGrid);
      setGameOver(true);
      Alert.alert('Game Over', 'Vous avez touché une mine !', [
        {text: 'Rejouer', onPress: initializeGame}
      ]);
      return;
    }

    let newGrid = [...grid];
    newGrid = revealEmptyCells(newGrid, row, col);
    setGrid(newGrid);
  };

  const handleLongPress = (row, col) => {
    if (gameOver || grid[row][col].isRevealed) return;

    const newGrid = [...grid];
    newGrid[row][col] = {
      ...newGrid[row][col],
      isFlagged: !newGrid[row][col].isFlagged
    };
    setGrid(newGrid);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Démineur Infini</Text>
      {grid.map((row, rowIndex) => (
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
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default Grid; 