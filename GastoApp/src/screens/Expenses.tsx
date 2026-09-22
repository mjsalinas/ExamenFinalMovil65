// Pantalla principal para registrar y visualizar los gastos
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchExpenses } from "../store/slices/expensesSlice";

export default function Expenses() {
  // Estados locales únicamente para los campos temporales del formulario
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  // Redux administra exclusivamente la lista de gastos
  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.expenses);

  // Cargamos los gastos almacenados en Supabase al abrir la pantalla
  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>GastoApp</Text>

      <TextInput
        style={styles.input}
        onChangeText={setCategory}
        value={category}
        placeholder="Categoría del gasto"
      />

      <TextInput
        style={styles.input}
        onChangeText={setDescription}
        value={description}
        placeholder="Descripción del gasto"
      />

      <TextInput
        style={styles.input}
        onChangeText={setAmount}
        value={amount}
        placeholder="Monto del gasto"
        keyboardType="numeric"
      />

      {/* Prueba visual temporal para confirmar que Redux cargó los gastos */}
      <Text>Gastos registrados: {expenses.length}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "80%",
    height: 48,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
  },
});