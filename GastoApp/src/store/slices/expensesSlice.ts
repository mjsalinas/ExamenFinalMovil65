import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

export type Expense = {
  id: string;
  description: string;
  amount: number;
  category: string;
};

export const fetchExpenses = createAsyncThunk('expenses/fetch', async () => {
  const { data, error } = await supabase.from('expenses').select('*');
  if (error) throw new Error(error.message);
  return data as Expense[];
});

export const addExpense = createAsyncThunk('expenses/add', async (expense: Omit<Expense, 'id'>) => {
  const { data, error } = await supabase.from('expenses').insert(expense).select().single();
  if (error) throw new Error(error.message);
  return data as Expense;
});

export const deleteExpense = createAsyncThunk('expenses/delete', async (id: string) => {
  const { error } = await supabase.from('expenses').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return id;
});


const expensesSlice = createSlice({
  name: 'expenses',
  initialState: [] as Expense[],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.fulfilled, (_, action) => action.payload)
      .addCase(addExpense.fulfilled, (state, action) => { state.push(action.payload); })
      .addCase(deleteExpense.fulfilled, (state, action) => state.filter(e => e.id !== action.payload));
  },
});

export default expensesSlice.reducer;
