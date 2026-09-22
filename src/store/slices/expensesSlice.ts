import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;  
}

export type NewExpense = Omit<Expense, 'id'>;

const initialState: Expense[] = [];

export const fetchExpenses = createAsyncThunk<Expense[]>(
  'expenses/fetchExpenses',
  async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data as Expense[];
  },
);

export const addExpense = createAsyncThunk<Expense, NewExpense>(
  'expenses/addExpense',
  async (expense) => {
    const { data, error } = await supabase
      .from('expenses')
      .insert(expense)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Expense;
  },
);

export const deleteExpense = createAsyncThunk<string, string>(
  'expenses/deleteExpense',
  async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return id;
  },
);

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.unshift(action.payload);
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        return state.filter((expense) => expense.id !== action.payload);
      });
  },
});

export default expensesSlice.reducer;
