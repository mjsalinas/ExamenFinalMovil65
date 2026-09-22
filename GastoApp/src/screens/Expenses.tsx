import { useEffect, useState } from 'react';
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

  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCategory('');
  };

  const handleAdd = async () => {
    const numericAmount = Number(amount);

    if (!description.trim() || !category || !numericAmount) {
      Alert.alert(
        'Datos incompletos',
        'Completa descripción, monto y categoría (el monto no puede ser 0).'
      );
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
      resetForm();
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteExpense(id)).unwrap();
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Gastos</Text>

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <View style={styles.categories}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, category === cat && styles.chipSelected]}
            onPress={() => setCategory(cat)}
          >
            <Text
              style={category === cat ? styles.chipTextSelected : styles.chipText}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Agregar gasto</Text>
      </TouchableOpacity>

      <Text style={styles.total}>Total: L. {total.toFixed(2)}</Text>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay gastos registrados.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.expenseRow}>
            <View style={styles.expenseInfo}>
              <Text style={styles.expenseDescription}>{item.description}</Text>
              <Text style={styles.expenseCategory}>{item.category}</Text>
            </View>
            <Text style={styles.expenseAmount}>
              L. {Number(item.amount).toFixed(2)}
            </Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 60 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  categories: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  chip: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  chipText: { color: '#333' },
  chipTextSelected: { color: '#fff' },
  button: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  total: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  empty: { textAlign: 'center', color: '#888', marginTop: 20 },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  expenseInfo: { flex: 1 },
  expenseDescription: { fontWeight: '600' },
  expenseCategory: { color: '#666', fontSize: 12 },
  expenseAmount: { marginHorizontal: 10, fontWeight: '600' },
  deleteText: { color: '#dc2626' },
});