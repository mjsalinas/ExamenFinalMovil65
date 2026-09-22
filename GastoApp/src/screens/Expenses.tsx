import { useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  addExpense,
  categories,
  Category,
  deleteExpense,
  fetchExpenses,
} from '../store/slices/expensesSlice';

export default function Expenses() {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.expenses);

  // Solo los campos del formulario se guardan localmente.
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category | ''>('');

  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  useEffect(() => {
    dispatch(fetchExpenses())
      .unwrap()
      .catch((error: unknown) => {
        console.error('Error al cargar los gastos:', error);
      });
  }, [dispatch]);

  async function save() {
    const numericAmount = Number(
      amount.trim().replace(',', '.')
    );

    // Validación obligatoria antes de enviar a Supabase.
    if (
      !description.trim() ||
      !amount.trim() ||
      !category ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
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

      // Restablecer únicamente si el registro fue exitoso.
      setDescription('');
      setAmount('');
      setCategory('');
      Keyboard.dismiss();
    } catch (error) {
      console.error('Error al guardar el gasto:', error);
    }
  }

  async function remove(id: string) {
    try {
      await dispatch(deleteExpense(id)).unwrap();
    } catch (error) {
      console.error('Error al eliminar el gasto:', error);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View>
              <Text style={styles.title}>GastoApp</Text>
              <Text style={styles.subtitle}>
                Tus gastos, en un solo lugar
              </Text>

              <View style={styles.totalCard}>
                <Text style={styles.totalLabel}>
                  TOTAL ACUMULADO
                </Text>
                <Text style={styles.total}>
                  L {total.toFixed(2)}
                </Text>
                <Text style={styles.totalLabel}>
                  {expenses.length} gastos registrados
                </Text>
              </View>

              <View style={styles.form}>
                <Text style={styles.heading}>Nuevo gasto</Text>

                <Text style={styles.label}>Descripción</Text>
                <TextInput
                  style={styles.input}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Ej. Almuerzo"
                  accessibilityLabel="Descripción del gasto"
                />

                <Text style={styles.label}>Monto (L)</Text>
                <TextInput
                  style={styles.input}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  accessibilityLabel="Monto del gasto"
                />

                <Text style={styles.label}>Categoría</Text>
                <View style={styles.categories}>
                  {categories.map((item) => (
                    <Pressable
                      key={item}
                      accessibilityRole="button"
                      accessibilityState={{
                        selected: category === item,
                      }}
                      onPress={() => setCategory(item)}
                      style={[
                        styles.chip,
                        category === item && styles.selected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          category === item &&
                            styles.selectedText,
                        ]}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Pressable
                  accessibilityRole="button"
                  onPress={save}
                  style={styles.save}
                >
                  <Text style={styles.saveText}>
                    Guardar gasto
                  </Text>
                </Pressable>
              </View>

              <View style={styles.listHeader}>
                <Text style={styles.heading}>Mis gastos</Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              Aún no hay gastos registrados. Agrega tu primer
              gasto.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.expense}>
              <View style={styles.expenseInfo}>
                <Text style={styles.expenseTitle}>
                  {item.description}
                </Text>
                <Text style={styles.subtitle}>
                  {item.category}
                </Text>
                <Text style={styles.amount}>
                  L {item.amount.toFixed(2)}
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Eliminar ${item.description}`}
                onPress={() => remove(item.id)}
                style={styles.delete}
              >
                <Text style={styles.deleteText}>
                  Eliminar
                </Text>
              </Pressable>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F3F3F3',
  },
  content: {
    padding: 20,
    paddingBottom: 36,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#202020',
  },
  subtitle: {
    color: '#606060',
    fontSize: 14,
    marginTop: 4,
  },
  totalCard: {
    backgroundColor: '#303030',
    borderRadius: 18,
    padding: 20,
    marginVertical: 20,
  },
  totalLabel: {
    color: '#E5E5E5',
    fontSize: 12,
  },
  total: {
    color: '#FFF',
    fontSize: 34,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  form: {
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 16,
  },
  heading: {
    fontSize: 19,
    fontWeight: '700',
    color: '#202020',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#404040',
    marginTop: 14,
    marginBottom: 7,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D2D2D2',
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 12,
    color: '#202020',
    fontSize: 16,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#D2D2D2',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
  },
  selected: {
    backgroundColor: '#303030',
    borderColor: '#303030',
  },
  chipText: {
    color: '#404040',
    fontSize: 13,
  },
  selectedText: {
    color: '#FFF',
  },
  save: {
    backgroundColor: '#176B55',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 18,
  },
  saveText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  listHeader: {
    marginTop: 24,
    marginBottom: 12,
  },
  empty: {
    color: '#606060',
    textAlign: 'center',
    padding: 20,
  },
  expense: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFF',
    marginBottom: 10,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202020',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#303030',
    marginTop: 8,
  },
  delete: {
    padding: 10,
  },
  deleteText: {
    color: '#AD2424',
    fontWeight: '600',
  },
});