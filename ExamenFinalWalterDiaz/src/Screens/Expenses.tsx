import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchExpenses,
  addExpense,
  deleteExpense,
  Expense,
} from '../store/slices/expensesSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const expenses = useAppSelector((state) => state.expenses);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      await dispatch(fetchExpenses()).unwrap();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudieron cargar los gastos.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    const trimmedDescription = description.trim();
    const parsedAmount = parseFloat(amount);

    if (!trimmedDescription) {
      Alert.alert('Validación', 'La descripción del gasto no puede estar vacía.');
      return;
    }

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Validación', 'El monto debe ser un número mayor a cero.');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Validación', 'Debe seleccionar una categoría para el gasto.');
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(
        addExpense({
          description: trimmedDescription,
          amount: parsedAmount,
          category: selectedCategory,
        })
      ).unwrap();

      // Restablecer los campos a su estado inicial al guardar exitosamente
      setDescription('');
      setAmount('');
      setSelectedCategory('');
      Alert.alert('Éxito', 'Gasto registrado correctamente.');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Error al guardar el gasto en Supabase.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = (id: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este gasto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteExpense(id)).unwrap();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Error al eliminar el gasto.');
            }
          },
        },
      ]
    );
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{item.category}</Text>
        </View>
      </View>

      <View style={styles.cardRight}>
        <Text style={styles.cardAmount}>Lps. {Number(item.amount).toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteExpense(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={renderExpenseItem}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.formContainer}>
              <Text style={styles.title}>Registro de Gastos</Text>

              {/* Descripcion */}
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Almuerzo de trabajo"
                placeholderTextColor="#999"
                value={description}
                onChangeText={setDescription}
              />

              {/* Monto */}
              <Text style={styles.label}>Monto (Lps.)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 15.50"
                placeholderTextColor="#999"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />

              {/* Categorias Selector */}
              <Text style={styles.label}>Categoría</Text>
              <View style={styles.chipsContainer}>
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.chip,
                        isSelected && styles.chipSelected,
                      ]}
                      onPress={() => setSelectedCategory(cat)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextSelected,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Boton Registrar Gasto */}
              <TouchableOpacity
                style={[styles.submitButton, submitting && styles.buttonDisabled]}
                onPress={handleAddExpense}
                disabled={submitting}
                activeOpacity={0.8}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Registrar Gasto</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.sectionHeader}>Historial de Gastos</Text>
              {loading && (
                <ActivityIndicator size="large" color="#4F46E5" style={{ marginVertical: 12 }} />
              )}
            </View>
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hay gastos registrados aún.</Text>
              </View>
            ) : null
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
    marginBottom: 14,
  },
  chip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipSelected: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardInfo: {
    flex: 1,
    paddingRight: 10,
  },
  cardDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: '#EEF2FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  cardAmount: {
    fontSize: 17,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 6,
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
