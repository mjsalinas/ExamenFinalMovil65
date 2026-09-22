import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchExpenses, addExpense, deleteExpense } from '../store/slices/expensesSlice';

export default function Expenses() {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector(state => state);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => { dispatch(fetchExpenses()); }, []);

  const handleAdd = () => {
    if (!description || !amount || !category) return;
    dispatch(addExpense({ description, amount: Number(amount), category }));
    setDescription(''); setAmount(''); setCategory('');
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <View>
      <TextInput placeholder="Descripción" value={description} onChangeText={setDescription} />
      <TextInput placeholder="Monto" value={amount} onChangeText={setAmount} keyboardType="numeric" />
      <TextInput placeholder="Categoría" value={category} onChangeText={setCategory} />
      <Button title="Agregar" onPress={handleAdd} />

      <FlatList
        data={expenses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.description} - ${item.amount} ({item.category})</Text>
            <Button title="Eliminar" onPress={() => dispatch(deleteExpense(item.id))} />
          </View>
        )}
      />
      <Text>Total: ${total}</Text>
    </View>
  );
}
