import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

export const EXPENSE_CATEGORIES = [
  'Alimentacion',
  'Transporte',
  'Entretenimiento',
  'Salud',
  'Educacion',
  'Otro',
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export type Expense = {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
};

const initialState: Expense[] = [];

export const fetchExpenses = createAsyncThunk<Expense[]>(
  'expenses/fetchExpenses',
  async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data as Expense[];
  }
);

export const addExpense = createAsyncThunk<Expense, Omit<Expense, 'id'>>(
  'expenses/addExpense',
  async (newExpense) => {
    const { data, error } = await supabase
      .from('expenses')
      .insert([newExpense])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Expense;
  }
);

export const deleteExpense = createAsyncThunk<string, string>(
  'expenses/deleteExpense',
  async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return id;
  }
);

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.fulfilled, (_state, action) => action.payload)
      .addCase(addExpense.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        return state.filter((expense) => expense.id !== action.payload);
      });
  },
});

export default expensesSlice.reducer;

