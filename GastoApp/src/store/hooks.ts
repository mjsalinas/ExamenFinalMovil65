// Importamos los hooks originales de React Redux
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// Importamos los tipos generados por nuestro store
import type { RootState, AppDispatch } from "./index";

// Hook tipado para ejecutar acciones de Redux
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Hook tipado para consultar información del store
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;