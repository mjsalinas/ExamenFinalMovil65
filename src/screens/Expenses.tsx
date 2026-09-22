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

const categories = [
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

  const handleAddExpense = async () => {
    const numericAmount = Number(amount);

    if (
      description.trim() === '' ||
      amount.trim() === '' ||
      numericAmount <= 0 ||
      category === ''
    ) {
      Alert.alert(
        'Campos incompletos',
        'Completa la descripción, el monto y la categoría.'
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

      setDescription('');
      setAmount('');
      setCategory('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el gasto.');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await dispatch(deleteExpense(id)).unwrap();
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el gasto.');
    }
  };

  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GastoApp</Text>

      <TextInput
        style={styles.input}
        placeholder="Descripción del gasto"
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

      <Text style={styles.subtitle}>Categoría</Text>

      <View style={styles.categoriesContainer}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.categoryButton,
              category === item && styles.selectedCategory,
            ]}
            onPress={() => setCategory(item)}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddExpense}
      >
        <Text style={styles.addButtonText}>Agregar gasto</Text>
      </TouchableOpacity>

      <Text style={styles.total}>
        Total: L {total.toFixed(2)}
      </Text>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No hay gastos registrados.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <View>
              <Text style={styles.expenseDescription}>
                {item.description}
              </Text>

              <Text>
                L {Number(item.amount).toFixed(2)}
              </Text>

              <Text>{item.category}</Text>
            </View>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteExpense(item.id)}
            >
              <Text style={styles.deleteButtonText}>
                Eliminar
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },

  categoryButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },

  selectedCategory: {
    backgroundColor: '#ddd',
  },

  addButton: {
    backgroundColor: '#222',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },

  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },

  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },

  expenseDescription: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  deleteButton: {
    padding: 8,
  },

  deleteButtonText: {
    fontWeight: 'bold',
  },
});