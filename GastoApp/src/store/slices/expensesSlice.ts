// Importamos createSlice para administrar el estado de los gastos con Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

// Definimos la estructura que tendrá cada gasto
export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
}

// El estado debe ser directamente un arreglo Expense[], como solicita el examen
const initialState: Expense[] = [];

// Creamos el slice base; los async thunks se agregarán en la siguiente parte
const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {},
});

// Exportamos el reducer para registrarlo en el store
export default expensesSlice.reducer;