import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
}

export type NewExpense = Omit<Expense, 'id'>;

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

export const addExpense = createAsyncThunk<Expense, NewExpense>(
  'expenses/addExpense',
  async (newExpense) => {
    const { data, error } = await supabase
      .from('expenses')
      .insert(newExpense)
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
  initialState: [] as Expense[],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.fulfilled, (_state, action) => action.payload)
      .addCase(addExpense.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(deleteExpense.fulfilled, (state, action) =>
        state.filter((expense) => expense.id !== action.payload)
      );
  },
});

export default expensesSlice.reducer;