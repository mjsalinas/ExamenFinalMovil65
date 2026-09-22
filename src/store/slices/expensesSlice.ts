import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";
import type { Expense } from "../../types/Expense";

// Cargar todos los gastos desde Supabase.
export const fetchExpenses = createAsyncThunk<
  Expense[],
  void,
  { rejectValue: string }
>("expenses/fetchExpenses", async (_, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from("expenses")
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data as Expense[];
});

// Agregar un nuevo gasto en Supabase.
export const addExpense = createAsyncThunk<
  Expense,
  Omit<Expense, "id">,
  { rejectValue: string }
>("expenses/addExpense", async (expense) => {
  const { data, error } = await supabase
    .from("expenses")
    .insert({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Expense;
});

// Eliminar un gasto de Supabase.
export const deleteExpense = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("expenses/deleteExpense", async (id) => {
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return id;
});

const initialState: Expense[] = [];

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.fulfilled, (_state, action) => {
        return action.payload;
      })

      .addCase(addExpense.fulfilled, (state, action) => {
        state.push(action.payload);
      })

      .addCase(deleteExpense.fulfilled, (state, action) => {
        return state.filter(
          (expense) => expense.id !== action.payload
        );
      });
  },
});

export default expensesSlice.reducer;