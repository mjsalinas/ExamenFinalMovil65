import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

export type Expense = {
  id: string;
  description: string;
  amount: number;
  category: string;
};

const CATEGORIES = [
  'Alimentacion',
  'Transporte',
  'Entretenimiento',
  'Salud',
  'Educacion',
  'Otro',
] as const;

export type ExpenseCategory = (typeof CATEGORIES)[number];

const initialState: Expense[] = [];

export const fetchExpenses = createAsyncThunk<Expense[]>(
  'expenses/fetchExpenses',
  async () => {
    const { data, error } = await supabase.from('expenses').select('*').order('id', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as Expense[];
  }
);

export const addExpense = createAsyncThunk<Expense, Omit<Expense, 'id'>>(
  'expenses/addExpense',
  async (expense) => {
    const { data, error } = await supabase
      .from('expenses')
      .insert([
        {
          description: expense.description,
          amount: Number(expense.amount),
          category: expense.category,
        },
      ])
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
      .addCase(addExpense.fulfilled, (state, action) => [action.payload, ...state])
      .addCase(deleteExpense.fulfilled, (state, action) => state.filter((expense) => expense.id !== action.payload));
  },
});

export const selectExpenseCategories = () => CATEGORIES;
export default expensesSlice.reducer;
