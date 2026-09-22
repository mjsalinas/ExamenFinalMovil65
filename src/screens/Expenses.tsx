import { useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { JSX } from 'react/jsx-runtime'
import { CategoryExpense, addExpense } from '../store/slices/expensesSlices'
import { useAppDispatch } from '../store/hooks'

const CategoryExpenses: { label: string; value: CategoryExpense }[] = [
  { label: 'Alimentacion', value: 'alimentacion' },
  { label: 'Transporte', value: 'transporte' },
  { label: 'Entretenimiento', value: 'entretenimiento' },
  { label: 'Salud', value: 'salud' },
  { label: 'Educacion', value: 'educacion' },
  { label: 'Otro', value: 'otro' },
]

export const Expenses = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const [description, setDescription] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [category, setCategory] = useState<CategoryExpense | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async (): Promise<void> => {
    const parsedAmount = parseFloat(amount)

    if (!description.trim()) {
      setError('Ingresa una descripcion.')
      return
    }
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Ingresa un monto mayor a cero.')
      return
    }
    if (!category) {
      setError('Selecciona una categoria.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await dispatch(
        addExpense({
          description: description.trim(),
          amount: parsedAmount,
          category,
        }),
      ).unwrap()
      setDescription('')
      setAmount('')
      setCategory(null)
      alert('Se agrego correctamente el gasto')
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se puedo agrear este gasto, intenta de nuevo',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuevo gasto</Text>

      <TextInput
        style={styles.input}
        placeholder="Descripcion del gasto"
        value={description}
        onChangeText={setDescription}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Monto (L.)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        editable={!loading}
      />

      <Text style={styles.label}>Categoria</Text>
      <View style={styles.chips}>
        {CategoryExpenses.map((item) => {
          const selected = category === item.value
          return (
            <Pressable
              key={item.value}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => setCategory(item.value)}
              disabled={loading}
            >
              <Text
                style={[styles.chipText, selected && styles.chipTextSelected]}
              >
                {item.label}
              </Text>
            </Pressable>
          )
        })}
      </View>

      {error !== null && <Text style={styles.error}>{error}</Text>}

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Guardar</Text>
        )}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 420,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#b9b9b9',
  },
  chipSelected: {
    borderColor: '#9b9b9b',
  },
  chipText: {
    fontSize: 14,
    color: '#333',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  error: {
    color: '#d33',
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#686868',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
