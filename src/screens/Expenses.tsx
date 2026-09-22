import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

export type ExpenseCategory =
  | 'Alimentacion'
  | 'Transporte'
  | 'Entretenimiento'
  | 'Salud'
  | 'Educacion'
  | 'Otro';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
}

// 1. Thunk para cargar gastos desde Supabase
export const fetchExpenses = createAsyncThunk<Expense[]>(
  'expenses/fetchExpenses',
  async () => {
    const { data, error } = await supabase.from('expenses').select('*');
    if (error) throw new Error(error.message);
    return data as Expense[];
  }
);

// 2. Thunk para agregar un nuevo gasto
export const addExpense = createAsyncThunk<Expense, Omit<Expense, 'id'>>(
  'expenses/addExpense',
  async (newExpense) => {
    const { data, error } = await supabase
      .from('expenses')
      .insert([newExpense])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Expense;
  }
);

export const deleteExpense = createAsyncThunk<string, string>(
  'expenses/deleteExpense',
  async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return id;
  }
);


const initialState: Expense[] = [];

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.fulfilled, (_, action) => {
        return action.payload;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        return state.filter((item) => item.id !== action.payload);
      });
  },
});

export default expensesSlice.reducer;