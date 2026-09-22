import { Button, Text, TouchableOpacity, StyleSheet, View } from "react-native";

type CustomButtonProps = {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    variant?: "primary" | "secondary" | "danger";
};

export default function CustomButton({ title, onPress, disabled = false, variant = "danger" }: CustomButtonProps) {
    const styles = getStyles(variant);

    return (
        <TouchableOpacity style={[styles.button, disabled ? styles.buttonPressed : null]} onPress={onPress} disabled={disabled}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}

const getStyles = (variant: "primary" | "secondary" | "danger") =>
    StyleSheet.create({
        container: {
            //backgroundColor: '#007AFF',
        },

        TouchableOpacity: {
            backgroundColor: '#007AFF',
            padding: 10,
            borderRadius: 5,
        },
        button: {
            backgroundColor: variant === "primary" ? "navy" :
                variant === "secondary" ? "lightblue" : 'lightgray',
            width: 150,
            padding: 12,
            borderRadius: 6,
        },

        buttonPressed: {
            padding: 10,
            borderRadius: 5,
            backgroundColor: '#406994',
        },
        buttonText: {
            color: variant === "primary" ? "white" : "black"
        }
    });