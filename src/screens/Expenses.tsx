import { useEffect, useState } from "react";
import {  Alert,  FlatList,  Pressable,  SafeAreaView,  StyleSheet,  Text,  TextInput,  View,} from "react-native";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {  addExpense,  deleteExpense,  fetchExpenses,} from "../store/slices/expensesSlice";

const categories = [
  "Alimentacion",
  "Transporte",
  "Entretenimiento",
  "Salud",
  "Educacion",
  "Otro",
];

export default function Expenses() {
  const dispatch = useAppDispatch();

  const expenses = useAppSelector((state) => state.expenses);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const handleSave = async () => {
    if (
      !description.trim() ||
      !amount.trim() ||
      !category ||
      Number(amount) <= 0
    ) {
      Alert.alert(
        "Datos incompletos",
        "Completa descripción, monto y categoría."
      );
      return;
    }

    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Monto inválido", "Ingresa un monto mayor que cero.");
      return;
    }

    try {
      await dispatch(
        addExpense({
          description: description.trim(),
          amount: numericAmount,
          category,
        })
      ).unwrap();

      setDescription("");
      setAmount("");
      setCategory("");

      Alert.alert("Éxito", "Gasto guardado correctamente.");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo guardar el gasto."
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteExpense(id)).unwrap();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el gasto."
      );
    }
  };

  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>GastoApp</Text>

            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Almuerzo"
              value={description}
              onChangeText={setDescription}
            />

            <Text style={styles.label}>Monto</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 150"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />

            <Text style={styles.label}>Categoría</Text>

            <View style={styles.categories}>
              {categories.map((item) => (
                <Pressable
                  key={item}
                  style={[
                    styles.categoryButton,
                    category === item && styles.categorySelected,
                  ]}
                  onPress={() => setCategory(item)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      category === item && styles.categoryTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Guardar gasto</Text>
            </Pressable>

            <Text style={styles.total}>
              Total: L. {total.toFixed(2)}
            </Text>

            <Text style={styles.subtitle}>Lista de gastos</Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            No hay gastos registrados.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.expenseCard}>
            <View style={styles.expenseInfo}>
              <Text style={styles.description}>
                {item.description}
              </Text>

              <Text style={styles.category}>
                {item.category}
              </Text>

              <Text style={styles.amount}>
                L. {Number(item.amount).toFixed(2)}
              </Text>
            </View>

            <Pressable
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.deleteText}>Eliminar</Text>
            </Pressable>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  list: {
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },

  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },

  categoryButton: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  categorySelected: {
    backgroundColor: "#333",
    borderColor: "#333",
  },

  categoryText: {
    fontSize: 14,
  },

  categoryTextSelected: {
    color: "#fff",
  },

  saveButton: {
    backgroundColor: "#222",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  total: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },

  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 10,
  },

  empty: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },

  expenseCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  expenseInfo: {
    flex: 1,
  },

  description: {
    fontSize: 17,
    fontWeight: "bold",
  },

  category: {
    color: "#666",
    marginTop: 4,
  },

  amount: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },

  deleteButton: {
    backgroundColor: "#ddd",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 10,
  },

  deleteText: {
    fontWeight: "600",
  },
});