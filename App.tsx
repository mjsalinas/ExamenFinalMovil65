import { useEffect, useReducer } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { KeyboardAvoidingView,Platform,Pressable,ScrollView,StyleSheet,Text,TextInput,View,Alert,} from 'react-native';
import { store } from './src/store';
import { useAppDispatch, useAppSelector } from './src/store/hooks';
import { addExpense, deleteExpense, fetchExpenses } from './src/store/slices/expensesSlice';

const categories = [
  'Alimentacion',     
  'Transporte',
  'Entretenimiento',
  'Salud',
  'Educacion',
  'Otro',
] as const;

interface FormState {
  description: string;
  amount: string;
  category: string;
  error: string;
}

type FormAction =
  | { type: 'setDescription'; value: string }
  | { type: 'setAmount'; value: string }
  | { type: 'setCategory'; value: string }
  | { type: 'setError'; value: string }
  | { type: 'reset' };

const initialFormState: FormState = {
  description: '',
  amount: '',
  category: '',
  error: '',
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = error.message;
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
  }

  return fallback;
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'setDescription':
      return { ...state, description: action.value };
    case 'setAmount':
      return { ...state, amount: action.value };
    case 'setCategory':
      return { ...state, category: action.value };
    case 'setError':
      return { ...state, error: action.value };
    case 'reset':
      return initialFormState;
    default:
      return state;
  }
}

function ExpenseForm() {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.expenses);
  const [form, formDispatch] = useReducer(formReducer, initialFormState);

  useEffect(() => {
    void dispatch(fetchExpenses());
  }, [dispatch]);

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleSubmit = async () => {
    const numericAmount = Number(form.amount.replace(',', '.'));

    if (!form.description.trim() || !form.amount.trim() || !form.category || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      formDispatch({ type: 'setError', value: 'Completa la descripcion, un monto mayor que cero y una categoria.' });
      return;
    }

    try {
      formDispatch({ type: 'setError', value: '' });
      await dispatch(
        addExpense({
          description: form.description.trim(),
          amount: numericAmount,
          category: form.category,
        }),
      ).unwrap();

      formDispatch({ type: 'reset' });
      Alert.alert('Gasto guardado', 'El gasto se registró correctamente.');
    } catch (submitError) {
      const message = getErrorMessage(submitError, 'No se pudo guardar el gasto.');
      formDispatch({
        type: 'setError',
        value: message,
      });
      Alert.alert('No se pudo guardar', message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteExpense(id)).unwrap();
    } catch (deleteError) {
      Alert.alert(
        'No se pudo eliminar',
        getErrorMessage(deleteError, 'Intenta nuevamente.'),
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Registrar gasto</Text>

        <Text style={styles.label}>Descripcion</Text>
        <TextInput
          value={form.description}
          onChangeText={(value) => formDispatch({ type: 'setDescription', value })}
          placeholder="Ej. Almuerzo"
          style={styles.input}
        />

        <Text style={styles.label}>Monto</Text>
        <TextInput
          value={form.amount}
          onChangeText={(value) => formDispatch({ type: 'setAmount', value })}
          placeholder="0.00"
          keyboardType="decimal-pad"
          style={styles.input}
        />

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categories}>
          {categories.map((option) => (
            <Pressable
              key={option}
              onPress={() => formDispatch({ type: 'setCategory', value: option })}
              style={[styles.category, form.category === option && styles.categorySelected]}
            >
              <Text style={[styles.categoryText, form.category === option && styles.categoryTextSelected]}>
                {option}
              </Text>
            </Pressable>
          ))}
        </View>

        {form.error ? <Text style={styles.error}>{form.error}</Text> : null}

        <Pressable onPress={handleSubmit} style={styles.submit}>
          <Text style={styles.submitText}>Guardar gasto</Text>
        </Pressable>

        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Gastos registrados</Text>
          <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
        </View>

        {expenses.length === 0 ? (
          <Text style={styles.empty}>No hay gastos registrados.</Text>
        ) : (
          expenses.map((expense) => (
            <View key={expense.id} style={styles.expenseItem}>
              <View style={styles.expenseDetails}>
                <Text style={styles.expenseDescription}>{expense.description}</Text>
                <Text style={styles.expenseCategory}>{expense.category}</Text>
              </View>
              <View style={styles.expenseActions}>
                <Text style={styles.expenseAmount}>${expense.amount.toFixed(2)}</Text>
                <Pressable onPress={() => void handleDelete(expense.id)} style={styles.deleteButton}>
                  <Text style={styles.deleteText}>Eliminar</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );

}

export default function App() {
  return (
    <Provider store={store}>
      <ExpenseForm />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f5',
  },
  content: {
    padding: 24,
    paddingTop: 72,
  },
  title: {
    color: '#173b32',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 28,
  },
  label: {
    color: '#173b32',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#cbd8d1',
    borderRadius: 8,
    borderWidth: 1,
    color: '#173b32',
    fontSize: 16,
    padding: 14,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
    category: {
    backgroundColor: '#fff',
    borderColor: '#cbd8d1',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  categorySelected: {
    backgroundColor: '#173b32',
    borderColor: '#173b32',
  },
  categoryText: {
    color: '#315447',
    fontSize: 14,
  },
  categoryTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  error: {
    color: '#b42318',
    marginTop: 18,
  },
  submit: {
    alignItems: 'center',
    backgroundColor: '#d26a3a',
    borderRadius: 8,
    marginTop: 24,
    padding: 16,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  listHeader: {
    borderBottomColor: '#cbd8d1',
    borderBottomWidth: 1,
    marginTop: 34,
    paddingBottom: 12,
  },
  sectionTitle: {
    color: '#173b32',
    fontSize: 21,
    fontWeight: '700',
  },
  total: {
    color: '#d26a3a',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 6,
  },
  empty: {
    color: '#60756c',
    fontSize: 15,
    paddingVertical: 20,
  },
  expenseItem: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#e1e9e4',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  expenseDetails: {
    flex: 1,
    paddingRight: 12,
  },
  expenseDescription: {
    color: '#173b32',
    fontSize: 16,
    fontWeight: '600',
  },
  expenseCategory: {
    color: '#60756c',
    fontSize: 14,
    marginTop: 4,
  },
  expenseActions: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    color: '#173b32',
    fontSize: 16,
    fontWeight: '700',
  },
  deleteButton: {
    marginTop: 8,
  },
  deleteText: {
    color: '#b42318',
    fontSize: 14,
    fontWeight: '600',
  },
});
