import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { supabase } from '../../lib/supabase'

type Category = 'transporte' | 'comida' | 'servicios' | 'alquiler'

export interface Expense {
  id: string
  description: string
  amount: number
  category: Category
}

export type NewExpense = Omit<Expense, 'id'>

export const fetchExpenses = createAsyncThunk<Expense[], void>(
  'expenses/fetchExpenses',
  async () => {
    const { data, error } = await supabase.from('expenses').select('*')

    if (error) throw new Error(error.message)

    return data as Expense[]
  },
)

export const addExpense = createAsyncThunk<Expense, NewExpense>(
  'expenses/addExpense',
  async (expenseData) => {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expenseData])
      .select()

    if (error) throw new Error(error.message)

    return data[0] as Expense
  },
)

export const deleteExpense = createAsyncThunk<string, string>(
  'expenses/deleteExpense',
  async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id)

    if (error) throw new Error(error.message)

    return id
  },
)

const expensesSlice = createSlice({
  name: 'expenses',
  initialState: [] as Expense[],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.fulfilled, (_state, action) => action.payload)
      .addCase(addExpense.fulfilled, (state, action) => {
        state.push(action.payload)
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        return state.filter((expense) => expense.id !== action.payload)
      })
  },
})

export default expensesSlice.reducer
