import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchExpenses,
  addExpense,
  deleteExpense,
  Expense,
} from '../store/slices/expensesSlice';

const CATEGORIES = [
  'Alimentacion',
  'Transporte',
  'Entretenimiento',
  'Salud',
  'Educacion',
  'Otro',
];

export default function ExpensesScreen() {
  const dispatch = useAppDispatch();
  // Se obtiene la lista de gastos desde el store (cumpliendo la restricción de no usar useState para la lista)
  const expenses = useAppSelector((state) => state.expenses);

  // Estados locales solo para los campos del formulario
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  // 1. Cargar datos al montar la pantalla
  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  // 2. Validación y registro del gasto
  const handleAddExpense = async () => {
    const parsedAmount = parseFloat(amount);

    if (!description.trim() || !category || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert(
        'Validación',
        'Por favor completa todos los campos y asegúrate de que el monto sea un número mayor a cero.'
      );
      return;
    }

    try {
      await dispatch(
        addExpense({
          description: description.trim(),
          amount: parsedAmount,
          category,
        })
      ).unwrap();

      // Limpiar formulario tras guardado exitoso
      setDescription('');
      setAmount('');
      setCategory('');
    } catch (error: any) {
      Alert.alert('Error al guardar', error.message || 'Ocurrió un error inesperado');
    }
  };

  // 3. Eliminar gasto
  const handleDeleteExpense = (id: string) => {
    Alert.alert('Eliminar Gasto', '¿Estás seguro de que deseas eliminar este gasto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await dispatch(deleteExpense(id)).unwrap();
          } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo eliminar el gasto');
          }
        },
      },
    ]);
  };

  // 4. Calcular Total Acumulado
  const totalAmount = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.description}</Text>
        <Text style={styles.cardCategory}>{item.category}</Text>
        <Text style={styles.cardAmount}>${Number(item.amount).toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteExpense(item.id)}
      >
        <Text style={styles.deleteButtonText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>GastoApp</Text>

      {/* Tarjeta del Total Acumulado */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Acumulado:</Text>
        <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
      </View>

      {/* Formulario */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Descripción del gasto"
          value={description}
          onChangeText={setDescription}
        />

        <TextInput
          style={styles.input}
          placeholder="Monto ($)"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        {/* Selector de Categorías (Chips) */}
        <Text style={styles.sectionLabel}>Seleccionar Categoría:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.chip,
                category === cat && styles.chipSelected,
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.chipText,
                  category === cat && styles.chipTextSelected,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.saveButton} onPress={handleAddExpense}>
          <Text style={styles.saveButtonText}>Agregar Gasto</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Gastos */}
      <Text style={styles.sectionTitle}>Historial de Gastos</Text>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={renderExpenseItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay gastos registrados todavía.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#333',
  },
  totalCard: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  totalValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    fontSize: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  chipContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: '#2563eb',
  },
  chipText: {
    color: '#374151',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#16a34a',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 1,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  cardCategory: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  cardAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2563eb',
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
  },
});