import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchExpenses,
  addExpense,
  deleteExpense,
} from '../store/slices/expensesSlice';

const CATEGORIES = [
  'Alimentacion',
  'Transporte',
  'Entretenimiento',
  'Salud',
  'Educacion',
  'Otro',
];

export default function Expenses() {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.expenses);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const handleAddExpense = () => {
    const numericAmount = parseFloat(amount);

    if (!description.trim() || isNaN(numericAmount) || numericAmount <= 0 || !category) {
      Alert.alert('Error de validación', 'Por favor llena todos los campos correctamente.');
      return;
    }

    dispatch(
      addExpense({
        description: description.trim(),
        amount: numericAmount,
        category,
      })
    );

    setDescription('');
    setAmount('');
    setCategory('');
  };

  const handleDelete = (id?: string) => {
    if (id) {
      dispatch(deleteExpense(id));
    }
  };

  const total = expenses.reduce((acc, item) => acc + Number(item.amount), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GastoApp</Text>

      {/* Formulario */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Monto"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.label}>Categoría:</Text>
        <View style={styles.categoryContainer}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                category === cat && styles.categoryChipSelected,
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === cat && styles.categoryTextSelected,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleAddExpense}>
          <Text style={styles.buttonText}>Agregar Gasto</Text>
        </TouchableOpacity>
      </View>

      {/* Total Acumulado */}
      <View style={styles.totalCard}>
        <Text style={styles.totalText}>Total Acumulado: ${total.toFixed(2)}</Text>
      </View>

      {/* Lista de Gastos */}
      {expenses.length === 0 ? (
        <Text style={styles.emptyText}>No hay gastos registrados</Text>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={({ item }) => (
            <View style={styles.expenseItem}>
              <View>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemAmount}>${Number(item.amount).toFixed(2)}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.deleteText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  form: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginBottom: 10 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 15 },
  categoryChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 15, backgroundColor: '#e0e0e0' },
  categoryChipSelected: { backgroundColor: '#007bff' },
  categoryText: { color: '#333', fontSize: 12 },
  categoryTextSelected: { color: '#fff', fontWeight: 'bold' },
  button: { backgroundColor: '#28a745', padding: 12, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  totalCard: { backgroundColor: '#333', padding: 12, borderRadius: 8, marginBottom: 15 },
  totalText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 20 },
  expenseItem: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8 },
  itemDescription: { fontSize: 16, fontWeight: 'bold' },
  itemCategory: { color: '#666', fontSize: 12 },
  itemRight: { alignItems: 'flex-end' },
  itemAmount: { fontSize: 16, fontWeight: 'bold', color: '#d9534f' },
  deleteButton: { marginTop: 5 },
  deleteText: { color: '#d9534f', fontSize: 12 },
});