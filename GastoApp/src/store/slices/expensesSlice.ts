// Importamos createSlice para administrar el estado de los gastos con Redux Toolkit
import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// Importamos el cliente configurado de Supabase
// Importamos el cliente configurado de Supabase
import { supabase } from "../../lib/supabase";


// Definimos la estructura que tendrá cada gasto
export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
}

// Datos requeridos al registrar un gasto; el id lo genera Supabase automáticamente
export type NewExpense = Omit<Expense, "id">;

// El estado debe ser directamente un arreglo Expense[], como solicita el examen
const initialState: Expense[] = [];

// Obtiene todos los gastos almacenados en Supabase
export const fetchExpenses = createAsyncThunk<Expense[]>(
  "expenses/fetchExpenses",
  async () => {
    const { data, error } = await supabase.from("expenses").select("*");

    // El examen exige lanzar el mensaje recibido desde Supabase
    if (error) throw new Error(error.message);

    return data as Expense[];
  }
);

// Inserta un nuevo gasto en Supabase y retorna el registro creado
export const addExpense = createAsyncThunk<Expense, NewExpense>(
  "expenses/addExpense",
  async (expense) => {
    const { data, error } = await supabase
      .from("expenses")
      .insert([expense])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data as Expense;
  }
);

// Elimina un gasto de Supabase utilizando su id
export const deleteExpense = createAsyncThunk<string, string>(
  "expenses/deleteExpense",
  async (id) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id);

    if (error) throw new Error(error.message);

    // Retornamos el id para eliminarlo también del estado de Redux
    return id;
  }
);

// Creamos el slice base; los async thunks se agregarán en la siguiente parte
const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {},

    // Actualizamos el arreglo únicamente cuando las operaciones con Supabase terminan correctamente
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.fulfilled, (_state, action) => {
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

// Exportamos el reducer para registrarlo en el store
export default expensesSlice.reducer;