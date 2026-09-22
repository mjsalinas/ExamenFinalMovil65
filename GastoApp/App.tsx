import 'react-native-url-polyfill/auto';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { store } from './src/store';
import Expenses from './src/screens/Expenses';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Expenses />
      </SafeAreaProvider>
    </Provider>
  );
}
