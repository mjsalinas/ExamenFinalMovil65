import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import {fetchExpenses, addExpense, deleteExpense } from '../store/slices/expensesSlices';

const Expenses = () => {
  const dispatch = useAppDispatch();

  const expenses = useAppSelector((state) => state.expenses);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => { dispatch(fetchExpenses()); }, [dispatch]);

  const handleAddExpense = async () => {
    if (!description.trim() || !amount.trim()) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    const amountNumber = Number(amount);

    if (isNaN(amountNumber) || amountNumber <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido');
      return;
    }

    try {
      await dispatch(
        addExpense({
          description: description.trim(),
          amount: amountNumber,
          date: new Date().toISOString(),
        })
      ).unwrap();

      setDescription('');
      setAmount('');

      Alert.alert('Éxito', 'Gasto agregado correctamente');
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'No se pudo agregar el gasto'
      );
    }
  };

  const handleDeleteExpense = (id: number) => {
    Alert.alert(
      'Eliminar gasto',
      '¿Estás seguro de que quieres eliminar este gasto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteExpense(id)).unwrap();
            } catch (error) {
              Alert.alert(
                'Error',
                error instanceof Error
                  ? error.message
                  : 'No se pudo eliminar el gasto'
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Gastos</Text>

      {/* Formulario */}
      <View style={styles.form}>
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
          keyboardType="decimal-pad"
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddExpense}
        >
          <Text style={styles.addButtonText}>
            Agregar gasto
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de gastos */}
      <Text style={styles.subtitle}>
        Gastos registrados
      </Text>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No hay gastos registrados.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.expenseCard}>
            <View style={styles.expenseInfo}>
              <Text style={styles.description}>
                {item.description}
              </Text>

              <Text style={styles.date}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.rightSection}>
              <Text style={styles.amount}>
                ${item.amount.toFixed(2)}
              </Text>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteExpense(item.id)}
              >
                <Text style={styles.deleteText}>
                  Eliminar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  form: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },

  addButton: {
    backgroundColor: '#5f0650',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  expenseCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  expenseInfo: {
    flex: 1,
  },

  description: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  date: {
    color: '#777777',
    fontSize: 13,
  },

  rightSection: {
    alignItems: 'flex-end',
  },

  amount: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  deleteButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  deleteText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  emptyText: {
    textAlign: 'center',
    color: '#777777',
    marginTop: 30,
    fontSize: 16,
  },
});

export default Expenses;