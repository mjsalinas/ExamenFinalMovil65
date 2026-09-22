import 'react-native-url-polyfill/auto';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import {store} from './src/store'
import Expenses from './src/screens/Expenses';
import { supabase } from './src/lib/supabase';


export default function App() {
  return (
    <View style={styles.container}>
     <Provider store={store}>
        <Expenses />
    </Provider>
      <StatusBar style="auto" />
    </View>
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
