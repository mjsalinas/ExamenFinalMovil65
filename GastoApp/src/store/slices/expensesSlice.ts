import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

export type Expense = {
    id: string;
    description: string;
    amount: number;
    category: string;
};

export const fetchExpenses = createAsyncThunk(
    'expenses/fetchExpenses', async () => {
        const { data, error } = await supabase.from('Expenses').select('*');
        if (error) throw new Error(error.message);
        return data as Expense[];
    });

export const addExpense = createAsyncThunk(
    'expenses/addExpense',
    async (expense: Omit<Expense, 'id'>) => {
        const { data, error } = await supabase.from(
            'expenses').insert([expense]).select().single();
        if (error) throw new Error(error.message);
        return data as Expense;
    }
);

export const deleteExpense = createAsyncThunk(
    'expenses/deleteExpense',
    async (id: string) => {
        const { error } = await supabase.from(
            'expenses').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return id;
    }
);

const expensesSlice = createSlice({
    name: 'expenses',
    initialState: [] as Expense[],
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchExpenses.fulfilled, (state, action) => {
            return action.payload;
        });
        builder.addCase(addExpense.fulfilled, (state, action) => {
            state.push(action.payload);
        });
        builder.addCase(deleteExpense.fulfilled, (state, action) => {
            return state.filter((expense) => expense.id !== action.payload);
        });
    },
});

export default expensesSlice.reducer;