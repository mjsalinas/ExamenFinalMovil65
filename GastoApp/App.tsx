// Polyfill requerido para utilizar correctamente Supabase en React Native
import "react-native-url-polyfill/auto";

import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { Provider } from "react-redux";
import { store } from "./src/store";

// PRUEBA TEMPORAL: comprobaremos la lectura de gastos desde Supabase
import { fetchExpenses } from "./src/store/slices/expensesSlice";
import { useState } from "react";

// PRUEBA TEMPORAL: ejecutamos fetchExpenses y mostramos el resultado en consola
store.dispatch(fetchExpenses()).then((result) => {
  console.log("Resultado fetchExpenses:", result);
});

export default function App() {
  // Estados locales únicamente para los campos temporales del formulario
const [category, setCategory] = useState("");
const [description, setDescription] = useState("");
const [amount, setAmount] = useState("");

  return (
    // Provider permite que todos los componentes tengan acceso al store de Redux

    <Provider store={store}>
      
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView>
        <Text>GastoApp</Text>
        <StatusBar style="auto" />
         {/* Campo temporal de categoría; luego lo cambiaremos por el selector requerido */}
<TextInput
  style={styles.input}
  onChangeText={setCategory}
  value={category}
  placeholder="Categoría del gasto"
/>
{/* Descripción del gasto */}
<TextInput
  style={styles.input}
  onChangeText={setDescription}
  value={description}
  placeholder="Descripción del gasto"
/>
        {/* Monto del gasto */}
<TextInput
  style={styles.input}
  onChangeText={setAmount}
  value={amount}
  placeholder="Monto del gasto"
  keyboardType="numeric"
/>
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
    
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center" 
  },

  input: {
    width: '80%',
    height: 48,
    margin: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    paddingHorizontal: 16, 
    marginBottom: 16,
  },
});
