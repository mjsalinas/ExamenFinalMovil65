import 'react-native-url-polyfill/auto';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import Expenses from './src/screens/Expenses';
import { store } from './src/store';

export default function App() {
  return (
    <Provider store={store}>
      <Expenses />
      <StatusBar style="auto" />
    </Provider>
  );
}
