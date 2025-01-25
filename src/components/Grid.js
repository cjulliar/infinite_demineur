import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, Text, Alert, ScrollView, PanResponder, Animated } from 'react-native';
import Cell from './Cell';
import { createGrid, revealEmptyCells } from '../utils/gameLogic';

const Grid = () => {
  const totalRows = 30;
  const totalCols = 30;
  const mines = 90;

  const [grid, setGrid] = useState(() => createGrid(totalRows, totalCols, mines));
  const [gameOver, setGameOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [touchCount, setTouchCount] = useState(0);
  
  const pan = useRef(new Animated.ValueXY()).current;
  const scrollRef = useRef(null);
  const horizontalScrollRef = useRef(null);
  const lastTap = useRef(0); // Pour détecter les taps vs drags

  const resetGame = useCallback(() => {
    setGrid(createGrid(totalRows, totalCols, mines));
    setGameOver(false);
    setIsDragging(false);
    pan.setValue({ x: 0, y: 0 });
    
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: 0, y: 0, animated: false });
    }
    if (horizontalScrollRef.current) {
      horizontalScrollRef.current.scrollTo({ x: 0, y: 0, animated: false });
    }
  }, []);

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: (evt) => {
      const touches = evt.nativeEvent.touches.length;
      console.log('Start touches:', touches);
      setTouchCount(touches);
      return touches === 2;  // N'accepte que si 2 doigts
    },

    onMoveShouldSetPanResponder: (evt, gestureState) => {
      const touches = evt.nativeEvent.touches.length;
      console.log('Move touches:', touches);
      setTouchCount(touches);
      return false;  // Ne jamais prendre le contrôle du mouvement ici
    },

    onPanResponderGrant: (evt) => {
      console.log('Grant touches:', evt.nativeEvent.touches.length);
      // Seulement initialiser le déplacement si 2 doigts
      if (evt.nativeEvent.touches.length === 2) {
        setIsDragging(true);
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        });
      } else {
        // Pour un doigt, on enregistre juste le moment du tap
        lastTap.current = Date.now();
      }
    },

    onPanResponderMove: (evt, gestureState) => {
      const touches = evt.nativeEvent.touches.length;
      console.log('Moving touches:', touches);
      setTouchCount(touches);

      // Bloquer immédiatement si moins de 2 doigts
      if (touches < 2) {
        return;
      }

      // Si on arrive ici, on a au moins 2 doigts
      if (isDragging && scrollRef.current && horizontalScrollRef.current) {
        horizontalScrollRef.current.scrollTo({
          x: -gestureState.dx + pan.x._offset,
          animated: false
        });
        scrollRef.current.scrollTo({
          y: -gestureState.dy + pan.y._offset,
          animated: false
        });
      }
    },

    onPanResponderRelease: (evt) => {
      console.log('Release'); // Debug
      setTouchCount(0); // Forcer à 0 au relâchement
      
      // Si on n'était pas en train de déplacer, c'était peut-être un tap
      if (!isDragging) {
        const now = Date.now();
        const tapDuration = now - lastTap.current;
        
        if (tapDuration < 200) {
          const locationX = evt.nativeEvent.locationX;
          const locationY = evt.nativeEvent.locationY;
          
          const col = Math.floor(locationX / 30);
          const row = Math.floor(locationY / 30);
          
          handlePress(row, col);
        }
      }

      setIsDragging(false);
      pan.flattenOffset();
    },

    onPanResponderTerminate: () => {
      console.log('Terminate'); // Debug
      setTouchCount(0); // Forcer à 0 à la terminaison
      setIsDragging(false);
      pan.flattenOffset();
    }
  }), [handlePress, isDragging]);

  const handlePress = useCallback((row, col) => {
    if (gameOver || grid[row][col].isFlagged) return;

    if (grid[row][col].isMine) {
      setGrid(prev => prev.map(row => row.map(cell => ({
        ...cell,
        isRevealed: true
      }))));
      setGameOver(true);
      Alert.alert('Game Over', 'Vous avez touché une mine !', [
        {text: 'Rejouer', onPress: resetGame}
      ]);
      return;
    }

    setGrid(prev => revealEmptyCells([...prev], row, col));
  }, [gameOver, resetGame]);

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
            onLongPress={() => handleLongPress(rowIndex, colIndex)}
          />
        ))}
      </View>
    ))
  ), [grid, handleLongPress]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nombre de doigts : {touchCount}</Text>
      <Text style={styles.title}>Démineur Infini</Text>
      <View {...panResponder.panHandlers} style={styles.scrollContainer}>
        <ScrollView
          ref={horizontalScrollRef}
          horizontal
          scrollEnabled={!isDragging}
          contentOffset={{ x: 0, y: 0 }}
        >
          <ScrollView
            ref={scrollRef}
            scrollEnabled={!isDragging}
            contentOffset={{ x: 0, y: 0 }}
          >
            <View style={styles.gridContainer}>
              {gridContent}
            </View>
          </ScrollView>
        </ScrollView>
      </View>
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
    overflow: 'hidden',
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