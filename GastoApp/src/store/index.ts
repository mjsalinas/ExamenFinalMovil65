// Importamos configureStore de Redux Toolkit
import { configureStore } from "@reduxjs/toolkit";

// Importamos el reducer encargado de los gastos
import expensesReducer from "./slices/expensesSlice";

// Configuramos el store global de la aplicación
export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
  },
});

// Exportamos los tipos derivados directamente del store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;