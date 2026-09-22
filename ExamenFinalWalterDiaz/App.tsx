import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import ExpensesScreen from './src/Screens/Expenses';

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <ExpensesScreen />
        <StatusBar style="dark" />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
});
