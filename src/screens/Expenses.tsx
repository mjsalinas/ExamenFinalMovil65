import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchExpenses,
  addExpense,
  deleteExpense,
} from '../store/slices/expensesSlice';
import { CATEGORIES, Category, Expense } from '../types/expense';

// Configuración de colores para cada categoría
const CATEGORY_STYLES: Record<
  Category,
  { color: string; bgColor: string }
> = {
  Alimentacion: { color: '#EA580C', bgColor: '#FFEDD5' },
  Transporte: { color: '#2563EB', bgColor: '#DBEAFE' },
  Entretenimiento: { color: '#7C3AED', bgColor: '#EDE9FE' },
  Salud: { color: '#DC2626', bgColor: '#FEE2E2' },
  Educacion: { color: '#0284C7', bgColor: '#E0F2FE' },
  Otro: { color: '#4B5563', bgColor: '#F3F4F6' },
};

export const Expenses: React.FC = () => {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.expenses);

  // Estados del formulario
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Carga inicial de gastos desde Supabase al montar la pantalla
  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  // Cálculo del total acumulado
  const totalAmount = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // Formato numérico sin símbolo de moneda
  const formatAmount = (val: number) => {
    return new Intl.NumberFormat('es-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  // Manejador para registrar un nuevo gasto
  const handleAddExpense = async () => {
    const trimmedDesc = description.trim();
    const cleanAmount = amount.replace(',', '.').trim();
    const numericAmount = parseFloat(cleanAmount);

    // Validación de campos vacíos o en cero
    if (!trimmedDesc) {
      Alert.alert('Validación', 'Por favor ingresa la descripción del gasto.');
      return;
    }

    if (!cleanAmount || isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Validación', 'El monto debe ser un número mayor a 0.');
      return;
    }

    if (!category) {
      Alert.alert('Validación', 'Por favor selecciona una categoría.');
      return;
    }

    try {
      setIsSubmitting(true);
      const resultAction = await dispatch(
        addExpense({
          description: trimmedDesc,
          amount: numericAmount,
          category,
        })
      );

      if (addExpense.fulfilled.match(resultAction)) {
        // Restablecer el formulario a su estado inicial
        setDescription('');
        setAmount('');
        setCategory('');
      } else {
        const errorMsg = resultAction.error.message || 'No se pudo guardar el gasto.';
        Alert.alert('Error', errorMsg);
      }
    } catch (err: any) {
      Alert.alert('Error inesperado', err?.message || 'Ocurrió un error al guardar el gasto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejador para eliminar un gasto
  const handleDeleteExpense = (id: string, itemDesc: string) => {
    Alert.alert(
      'Eliminar gasto',
      `¿Estás seguro de que deseas eliminar "${itemDesc}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingId(id);
              const resultAction = await dispatch(deleteExpense(id));
              if (deleteExpense.rejected.match(resultAction)) {
                Alert.alert('Error', resultAction.error.message || 'No se pudo eliminar el gasto.');
              }
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'Ocurrió un error al eliminar.');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  // Renderizado de cada tarjeta de gasto
  const renderExpenseItem = ({ item }: { item: Expense }) => {
    const catStyle = CATEGORY_STYLES[item.category as Category] || {
      color: '#4B5563',
      bgColor: '#F3F4F6',
    };
    const isDeleting = deletingId === item.id;

    return (
      <View style={styles.itemCard}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemDescription} numberOfLines={1}>
            {item.description}
          </Text>
          <View style={styles.itemCategoryBadge}>
            <Text style={[styles.itemCategoryText, { color: catStyle.color }]}>
              {item.category}
            </Text>
          </View>
        </View>

        <View style={styles.itemRight}>
          <Text style={styles.itemAmount}>-{formatAmount(item.amount)}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteExpense(item.id, item.description)}
            disabled={isDeleting}
            activeOpacity={0.7}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>GastoApp</Text>
          <Text style={styles.headerSubtitle}>Control de Gastos Personales</Text>
        </View>

        {/* Tarjeta de Total Acumulado */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <Text style={styles.summaryLabel}>Total Acumulado</Text>
            <View style={styles.summaryBadge}>
              <Text style={styles.summaryBadgeText}>
                {expenses.length} {expenses.length === 1 ? 'gasto' : 'gastos'}
              </Text>
            </View>
          </View>
          <Text style={styles.summaryAmount}>{formatAmount(totalAmount)}</Text>
        </View>

        {/* Formulario de Registro */}
        <View style={styles.formContainer}>
          <Text style={styles.formSectionTitle}>Registrar Nuevo Gasto</Text>

          {/* Campo Descripción */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Descripción</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Almuerzo o Supermercado"
              placeholderTextColor="#64748B"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Campo Monto */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Monto</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#64748B"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Selector de Categoría */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Categoría</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScroll}
            >
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                const catStyle = CATEGORY_STYLES[cat];
                return (
                  <TouchableOpacity
                    key={cat}
                    activeOpacity={0.7}
                    onPress={() => setCategory(cat)}
                    style={[
                      styles.categoryChip,
                      isSelected && {
                        backgroundColor: catStyle.color,
                        borderColor: catStyle.color,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        isSelected && styles.categoryChipTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Botón de Registro */}
          <TouchableOpacity
            style={[styles.addButton, isSubmitting && styles.addButtonDisabled]}
            onPress={handleAddExpense}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.addButtonText}>Agregar Gasto</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Sección de Lista de Gastos */}
        <View style={styles.listSection}>
          <Text style={styles.listSectionTitle}>Gastos Registrados</Text>
          <FlatList
            data={expenses}
            keyExtractor={(item) => item.id}
            renderItem={renderExpenseItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No hay gastos registrados</Text>
                <Text style={styles.emptySubtitle}>
                  Utiliza el formulario superior para ingresar tus gastos personales.
                </Text>
              </View>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  header: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  summaryBadgeText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '700',
  },
  summaryAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#38BDF8',
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  formSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: '#F8FAFC',
    fontSize: 14,
  },
  categoriesScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  categoryChip: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
  },
  categoryChipText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 4,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  listSection: {
    flex: 1,
    marginTop: 4,
  },
  listSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  itemInfo: {
    flex: 1,
  },
  itemDescription: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  itemCategoryBadge: {
    alignSelf: 'flex-start',
  },
  itemCategoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  itemRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 8,
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F87171',
    marginBottom: 4,
  },
  deleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#451A1A',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#7F1D1D',
  },
  deleteButtonText: {
    color: '#F87171',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#94A3B8',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
});
