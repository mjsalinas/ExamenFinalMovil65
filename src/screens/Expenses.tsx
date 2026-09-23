import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  addExpense,
  deleteExpense,
  EXPENSE_CATEGORIES,
  fetchExpenses,
  type ExpenseCategory,
} from '../store/slices/expensesSlice';

export default function ExpensesScreen() {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.expenses);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory | null>(null);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCategory(null);
  };

  const handleSave = async () => {
    const amountNumber = Number(amount);

    if (!description.trim() || !amount || amountNumber <= 0 || !category) {
      return;
    }

    await dispatch(
      addExpense({
        description: description.trim(),
        amount: amountNumber,
        category,
      })
    );

    resetForm();
  };

  const handleDelete = (id: string) => {
    dispatch(deleteExpense(id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Registrar gasto</Text>

        <Text style={styles.label}>Descripcion</Text>
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
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoryWrapper}>
          {EXPENSE_CATEGORIES.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.categoryChip,
                category === item && styles.categoryChipSelected,
              ]}
              onPress={() => setCategory(item)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  category === item && styles.categoryChipTextSelected,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar gasto</Text>
        </TouchableOpacity>

        <View style={styles.totalRow}>
          <Text style={styles.title}>Gastos registrados</Text>
          <Text style={styles.totalText}>Total: L. {total.toFixed(2)}</Text>
        </View>

        {expenses.length === 0 ? (
          <Text style={styles.emptyText}>Todavia no has registrado gastos</Text>
        ) : (
          expenses.map((expense) => (
            <View key={expense.id} style={styles.expenseItem}>
              <View style={styles.expenseInfo}>
                <Text style={styles.expenseDescription}>{expense.description}</Text>
                <Text style={styles.expenseCategory}>{expense.category}</Text>
              </View>
              <Text style={styles.expenseAmount}>L. {expense.amount.toFixed(2)}</Text>
              <TouchableOpacity onPress={() => handleDelete(expense.id)}>
                <Text style={styles.deleteButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  categoryWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  categoryChipSelected: {
    backgroundColor: '#1F5C9E',
    borderColor: '#1F5C9E',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#333333',
  },
  categoryChipTextSelected: {
    color: '#ffffff',
  },
  saveButton: {
    backgroundColor: '#1F5C9E',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingVertical: 12,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '600',
  },
  expenseCategory: {
    fontSize: 13,
    color: '#666666',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  deleteButtonText: {
    color: '#C00000',
    fontSize: 14,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F5C9E',
  },
});