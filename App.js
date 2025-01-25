import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Grid from './src/components/Grid';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Grid />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 