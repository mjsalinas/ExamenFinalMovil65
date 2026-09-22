import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../../lib/Supabase';

export type Expense = {
  id: number;
  description: string;
  amount: number;
  date: string;
};

export const fetchExpenses = createAsyncThunk(
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
  }
);

export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async (expense: Omit<Expense, 'id'>) => {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expense])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Expense;
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (id: number) => {
    const { data, error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Expense;
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
        return state.filter(
          (expense) => expense.id !== action.payload.id
        );
      });
  },
});

export default expensesSlice.reducer;