// Polyfill requerido para utilizar correctamente Supabase en React Native
import "react-native-url-polyfill/auto";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { Provider } from "react-redux";
import { store } from "./src/store";

export default function App() {
  return (
    // Provider permite que todos los componentes tengan acceso al store de Redux
    <Provider store={store}>
      <View style={styles.container}>
        <Text>GastoApp</Text>
        <Text>Redux configurado correctamente</Text>
        <StatusBar style="auto" />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center" 
  },
});
