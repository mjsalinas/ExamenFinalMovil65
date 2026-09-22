import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { store } from './src/store';
import { Expenses } from './src/screens/Expenses';

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar style="light" />
      <Expenses />
    </Provider>
  );
}
