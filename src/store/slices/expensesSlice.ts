import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;  
}

export type NewExpense = Omit<Expense, 'id'>;

interface ExpensesState {
  items: Expense[];
  loading: boolean;
  error: string | null;
}

const initialState: ExpensesState = {
  items: [],
  loading: false,
  error: null,
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'An unexpected error occurred';

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
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = getErrorMessage(action.error);
      })
      .addCase(addExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = getErrorMessage(action.error);
      })
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((expense) => expense.id !== action.payload);
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = getErrorMessage(action.error);
      });
  },
});

export default expensesSlice.reducer;
