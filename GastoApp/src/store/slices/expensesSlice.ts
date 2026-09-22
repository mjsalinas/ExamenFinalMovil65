import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Expense = {
	id: string;
	description: string;
	amount: number;
};

type ExpensesState = {
	items: Expense[];
};

const initialState: ExpensesState = {
	items: [],
};

const expensesSlice = createSlice({
	name: 'expenses',
	initialState,
	reducers: {
		addExpense: (state, action: PayloadAction<Omit<Expense, 'id'>>) => {
			state.items.unshift({
				...action.payload,
				id: Date.now().toString(),
			});
		},
		removeExpense: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter((expense) => expense.id !== action.payload);
		},
	},
});

export const { addExpense, removeExpense } = expensesSlice.actions;
export const selectExpenses = (state: { expenses: ExpensesState }) => state.expenses.items;
export const selectTotalExpenses = (state: { expenses: ExpensesState }) =>
	state.expenses.items.reduce((total, expense) => total + expense.amount, 0);

export default expensesSlice.reducer;
