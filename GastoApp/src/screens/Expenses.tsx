import { useState } from 'react';
import {
	FlatList,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import { addExpense, removeExpense } from '../store/slices/expensesSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const currencyFormatter = new Intl.NumberFormat('es-MX', {
	style: 'currency',
	currency: 'MXN',
});

export default function Expenses() {
	const dispatch = useAppDispatch();
	const expenses = useAppSelector((state) => state.expenses.items);
	const total = useAppSelector((state) =>
		state.expenses.items.reduce((sum, expense) => sum + expense.amount, 0),
	);
	const [description, setDescription] = useState('');
	const [amount, setAmount] = useState('');

	const handleAddExpense = () => {
		const parsedAmount = Number(amount.replace(',', '.'));
		if (!description.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
			return;
		}

		dispatch(addExpense({ description: description.trim(), amount: parsedAmount }));
		setDescription('');
		setAmount('');
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			style={styles.container}
		>
			<View style={styles.header}>
				<Text style={styles.eyebrow}>GASTOAPP</Text>
				<Text style={styles.title}>Mis gastos</Text>
				<Text style={styles.total}>{currencyFormatter.format(total)}</Text>
				<Text style={styles.caption}>Total registrado</Text>
			</View>

			<View style={styles.form}>
				<TextInput
					placeholder="Descripcion"
					placeholderTextColor="#8992a3"
					value={description}
					onChangeText={setDescription}
					style={styles.input}
					returnKeyType="next"
				/>
				<TextInput
					placeholder="Monto"
					placeholderTextColor="#8992a3"
					value={amount}
					onChangeText={setAmount}
					keyboardType="decimal-pad"
					style={[styles.input, styles.amountInput]}
				/>
				<Pressable style={styles.addButton} onPress={handleAddExpense}>
					<Text style={styles.addButtonText}>Agregar</Text>
				</Pressable>
			</View>

			<FlatList
				data={expenses}
				keyExtractor={(expense) => expense.id}
				contentContainerStyle={styles.list}
				ListEmptyComponent={<Text style={styles.empty}>Aun no tienes gastos registrados.</Text>}
				renderItem={({ item }) => (
					<View style={styles.expenseRow}>
						<View>
							<Text style={styles.expenseDescription}>{item.description}</Text>
							<Text style={styles.expenseAmount}>{currencyFormatter.format(item.amount)}</Text>
						</View>
						<Pressable onPress={() => dispatch(removeExpense(item.id))}>
							<Text style={styles.deleteText}>Eliminar</Text>
						</Pressable>
					</View>
				)}
			/>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#f4f1ea' },
	header: { backgroundColor: '#173f3a', padding: 24, paddingTop: 64 },
	eyebrow: { color: '#e8b86a', fontSize: 12, fontWeight: '700', letterSpacing: 2 },
	title: { color: '#fffaf0', fontSize: 34, fontWeight: '800', marginTop: 8 },
	total: { color: '#fffaf0', fontSize: 28, fontWeight: '700', marginTop: 28 },
	caption: { color: '#b7cbc2', fontSize: 14, marginTop: 2 },
	form: { padding: 20, gap: 10 },
	input: {
		backgroundColor: '#fffaf0', borderColor: '#d8d1c2', borderRadius: 8,
		borderWidth: 1, color: '#1b2827', fontSize: 16, padding: 14,
	},
	amountInput: { flex: 1 },
	addButton: { alignItems: 'center', backgroundColor: '#d9825b', borderRadius: 8, padding: 15 },
	addButtonText: { color: '#fffaf0', fontSize: 16, fontWeight: '700' },
	list: { gap: 10, paddingHorizontal: 20, paddingBottom: 24 },
	empty: { color: '#69716f', fontSize: 16, paddingTop: 20, textAlign: 'center' },
	expenseRow: {
		alignItems: 'center', backgroundColor: '#fffaf0', borderRadius: 8,
		flexDirection: 'row', justifyContent: 'space-between', padding: 16,
	},
	expenseDescription: { color: '#1b2827', fontSize: 16, fontWeight: '700' },
	expenseAmount: { color: '#69716f', fontSize: 14, marginTop: 4 },
	deleteText: { color: '#b54d46', fontSize: 14, fontWeight: '700' },
});
