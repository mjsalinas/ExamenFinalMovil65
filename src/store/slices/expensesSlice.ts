import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
}

// 1. AsyncThunk para obtener todos los gastos (SELECT sin filtros)
export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data as Expense[];
  }
);

// 2. AsyncThunk para insertar un gasto (INSERT)
export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async (newExpense: Omit<Expense, 'id'>) => {
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

// 3. AsyncThunk para eliminar un gasto por id (DELETE)
export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (id: string) => {
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

const initialState: Expense[] = [];

export const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Cargar lista completa
      .addCase(fetchExpenses.fulfilled, (_state, action) => {
        return action.payload;
      })
      // Agregar nuevo registro a la lista
      .addCase(addExpense.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      // Eliminar registro por id
      .addCase(deleteExpense.fulfilled, (state, action) => {
        return state.filter((expense) => expense.id !== action.payload);
      });
  },
});

export default expensesSlice.reducer;