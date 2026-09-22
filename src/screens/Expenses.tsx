import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addExpense, deleteExpense, fetchExpenses, type ExpenseCategory, type Expense } from '../store/slices/expensesSlice';

const categories: ExpenseCategory[] = [
  'Alimentacion',
  'Transporte',
  'Entretenimiento',
  'Salud',
  'Educacion',
  'Otro',
];

export default function ExpensesScreen() {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.expenses);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Alimentacion');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const total = useMemo(
    () => expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [expenses]
  );

  const validateForm = () => {
    if (!description.trim()) {
      Alert.alert('Validación', 'La descripción es obligatoria.');
      return false;
    }

    const numericAmount = Number(amount);
    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Validación', 'El monto debe ser mayor a cero.');
      return false;
    }

    if (!categories.includes(category)) {
      Alert.alert('Validación', 'Selecciona una categoría válida.');
      return false;
    }

    return true;
  };

  const handleAddExpense = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        addExpense({
          description: description.trim(),
          amount: Number(amount),
          category,
        })
      ).unwrap();

      setDescription('');
      setAmount('');
      setCategory('Alimentacion');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'No se pudo guardar el gasto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await dispatch(deleteExpense(id)).unwrap();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'No se pudo eliminar el gasto.');
    }
  };

  const renderItem = ({ item }: { item: Expense }) => (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.description}</Text>
        <Text style={styles.subtitle}>${Number(item.amount).toFixed(2)} · {item.category}</Text>
      </View>
      <Pressable style={styles.deleteButton} onPress={() => handleDeleteExpense(item.id)}>
        <Text style={styles.deleteText}>Eliminar</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>GastoApp</Text>

      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Descripción del gasto"
        style={styles.input}
      />

      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Monto"
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.categoryWrap}>
        {categories.map((item) => {
          const selected = item === category;
          return (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
              style={[styles.categoryButton, selected && styles.selectedCategory]}
            >
              <Text style={[styles.categoryText, selected && styles.selectedCategoryText]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        disabled={isSubmitting}
        onPress={handleAddExpense}
        style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
      >
        <Text style={styles.saveButtonText}>{isSubmitting ? 'Guardando...' : 'Guardar gasto'}</Text>
      </Pressable>

      <Text style={styles.total}>Total acumulado: ${total.toFixed(2)}</Text>

      {expenses.length === 0 ? (
        <Text style={styles.empty}>No hay gastos registrados.</Text>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f6fb',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1f2937',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#dfe3ea',
    marginBottom: 12,
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: '#2563eb',
  },
  categoryText: {
    color: '#374151',
    fontWeight: '600',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    color: '#6b7280',
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '700',
  },
  empty: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
    marginTop: 20,
  },
});
