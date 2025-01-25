import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Cell from './Cell';

const Grid = () => {
  // Changeons la taille à 12x12
  const rows = 12;
  const cols = 12;
  
  // Créer une grille vide
  const grid = Array(rows).fill().map(() => Array(cols).fill(0));
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Démineur Infini</Text>
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              onPress={() => console.log(`Cell pressed: ${rowIndex}, ${colIndex}`)}
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