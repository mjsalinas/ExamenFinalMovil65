import 'react-native-url-polyfill/auto';

import React from 'react';
import { Provider } from 'react-redux';

import { store } from './src/store';
import Expenses from './src/screens/Expenses';

export default function App() {
  return (
    <Provider store={store}>
      <Expenses />
    </Provider>
  );
}
