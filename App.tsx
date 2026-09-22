import 'react-native-url-polyfill'
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import ExpensesScreen from './src/screens/Expenses';
import { store } from './src/store';

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      <ExpensesScreen />
    </Provider>
  );
}
