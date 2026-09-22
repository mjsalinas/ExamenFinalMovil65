export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  created_at?: string;
}

export interface NewExpensePayload {
  description: string;
  amount: number;
  category: string;
}

export const CATEGORIES = [
  'Alimentacion',
  'Transporte',
  'Entretenimiento',
  'Salud',
  'Educacion',
  'Otro',
] as const;

export type Category = (typeof CATEGORIES)[number];
