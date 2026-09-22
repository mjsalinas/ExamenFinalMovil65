// Polyfill requerido para utilizar correctamente Supabase en React Native
import "react-native-url-polyfill/auto";

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { StatusBar } from "expo-status-bar";


import { Provider } from "react-redux";
import { store } from "./src/store";
// Pantalla principal de gestión de gastos
import Expenses from "./src/screens/Expenses";

// PRUEBA TEMPORAL: comprobaremos la lectura de gastos desde Supabase
import { fetchExpenses } from "./src/store/slices/expensesSlice";

// PRUEBA TEMPORAL: ejecutamos fetchExpenses y mostramos el resultado en consola
store.dispatch(fetchExpenses()).then((result) => {
  console.log("Resultado fetchExpenses:", result);
});

export default function App() {


  return (
    // Provider permite que todos los componentes tengan acceso al store de Redux

    <Provider store={store}>
      <SafeAreaProvider>
        <Expenses />
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </Provider>
  );
}

