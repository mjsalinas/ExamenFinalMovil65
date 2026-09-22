import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

export interface Expense {
  id?: string;
  description: string;
  amount: number;
  category: string;
}

export const fetchExpenses = createAsyncThunk<Expense[]>(
  'expenses/fetchExpenses',
  async () => {
    const { data, error } = await supabase.from('expenses').select('*');
    if (error) throw new Error(error.message);
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

const expensesSlice = createSlice({
  name: 'expenses',
  initialState: [] as Expense[],
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
        return state.filter((expense) => expense.id !== action.payload);
      });
  },
});

export default expensesSlice.reducer;