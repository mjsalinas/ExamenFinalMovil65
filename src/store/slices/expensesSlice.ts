import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import { Expense, NewExpensePayload } from '../../types/expense';

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

    return (data || []).map((item) => ({
      ...item,
      amount: Number(item.amount),
    })) as Expense[];
  }
);

export const addExpense = createAsyncThunk<Expense, NewExpensePayload>(
  'expenses/addExpense',
  async (newExpense) => {
    const { data, error } = await supabase
    .from('expenses')
    .insert([
      {
        description : newExpense.description.trim(),
        amount: Number(newExpense.amount),
        category: newExpense.category,
      },
    ])
    .select()
    .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      ...data,
      amount: Number(data.amount),
    } as Expense;
  }
)


export const deleteExpense = createAsyncThunk<string, string>(
  'expenses/deleteExpense',
  async (id) => {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return id;
  }
);

export const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchExpenses
      .addCase(fetchExpenses.fulfilled, (_state, action: PayloadAction<Expense[]>) => {
        return action.payload;
      })
      // addExpense
      .addCase(addExpense.fulfilled, (state, action: PayloadAction<Expense>) => {
        state.unshift(action.payload);
      })
      .addCase(deleteExpense.fulfilled, (state, action: PayloadAction<string>) => {
        return state.filter((expense) => expense.id !== action.payload);
      });

  },
});

export default expensesSlice.reducer;