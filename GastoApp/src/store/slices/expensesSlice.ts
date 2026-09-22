import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

export const categories = ['Alimentacion', 'Transporte', 'Entretenimiento', 'Salud', 'Educacion', 'Otro'] as const;
export type Category = typeof categories[number];
export type Expense = {
  id: string;
  description: string;
  amount: number;
  category: Category;
};
export type NewExpense = Omit<Expense, 'id'>;
export const fetchExpenses = createAsyncThunk<Expense[]>(
  'expenses/fetchExpenses',
  async () => {
    const { data, error } = await supabase.from('expenses').select('*');
    if (error) throw new Error(error.message);
    return (data ?? []).map((expense) => ({ ...expense, amount: Number(expense.amount) })) as Expense[];
  },
);

export const addExpense = createAsyncThunk<Expense, NewExpense>(
  'expenses/addExpense',
  async (expense) => {
    const { data, error } = await supabase.from('expenses')
      .insert({ ...expense, amount: Number(expense.amount) }).select().single();
    if (error) throw new Error(error.message);
    return { ...data, amount: Number(data.amount) } as Expense;
  },
);

export const deleteExpense = createAsyncThunk<string, string>(
  'expenses/deleteExpense',
  async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return id;
  },
);

const initialState: Expense[] = [];
const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.fulfilled, (_state, action) => action.payload)
      .addCase(addExpense.fulfilled, (state, action) => { state.unshift(action.payload); })
      .addCase(deleteExpense.fulfilled, (state, action) => state.filter((expense) => expense.id !== action.payload));
  },
});

export default expensesSlice.reducer;
