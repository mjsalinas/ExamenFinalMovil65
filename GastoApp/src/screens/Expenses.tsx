import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchExpenses, addExpense, deleteExpense } from '../store/slices/expensesSlice';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

export default function Expenses() {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.expenses);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Alimentacion');

  const categories = ['Alimentacion', 'Transporte', 'Entretenimiento', 'Salud', 'Educacion', 'Otro'];

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const handleAdd = () => {
    const numericAmount = Number(amount);
    
    if (!description.trim() || !amount.trim() || numericAmount <= 0 || !category) {
      alert("Complete todos los campos correctamente.");
      return;
    }
    
    dispatch(addExpense({ 
      description: description.trim(), 
      amount: numericAmount, 
      category 
    }));
    
setDescription('');
    setAmount('');
    setCategory('Alimentacion');
  };

  const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Gastos</Text>
      
      <View style={styles.form}>
        <CustomInput
          placeholder="Descripción"
          values={description}
          OnChangeText={setDescription}
          type="text"
        />
        
        <CustomInput
          placeholder="Monto"
          values={amount}
          OnChangeText={setAmount}
          type="number"
        />

        <View style={styles.categories}>
          {categories.map((cat) => (
            <CustomButton
              key={cat}
              title={cat}
              variant={category === cat ? "primary" : "secondary"}
              onPress={() => setCategory(cat)}
            />
          ))}
        </View>

        <View style={styles.centerButton}>
          <CustomButton 
            title="Agregar Gasto" 
            onPress={handleAdd} 
            variant="primary" 
          />
        </View>
      </View>

      <Text style={styles.total}>Total Acumulado: ${total.toFixed(2)}</Text>

      {expenses.length === 0 ? (
        <Text style={styles.empty}>No hay gastos registrados.</Text>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemDesc}>{item.description}</Text>
                <Text>{item.category} - ${Number(item.amount).toFixed(2)}</Text>
              </View>
              
              <CustomButton 
                title="Eliminar" 
                variant="danger" 
                onPress={() => dispatch(deleteExpense(item.id))} 
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    marginTop: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  form: { 
    marginBottom: 20 
  },
  categories: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8, 
    marginBottom: 15, 
    justifyContent: 'center' 
  },
  centerButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  item: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 10, 
    borderWidth: 1, 
    borderColor: '#eee', 
    marginBottom: 8, 
    borderRadius: 5 
  },
  itemInfo: { 
    flex: 1 
  },
  itemDesc: { 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  total: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    textAlign: 'center', 
    color: '#4CAF50' 
  },
  empty: { 
    textAlign: 'center', 
    fontStyle: 'italic', 
    marginTop: 20 
  }
});