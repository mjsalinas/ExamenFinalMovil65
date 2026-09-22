import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity, KeyboardTypeOptions } from 'react-native';

//<Octicons place="number" size={24} color="black" />

type CustomInputProps = {
  values: string;
  placeholder: string;
  OnChangeText: (text: string) => void;
  type?: 'text' | 'email' | 'password' | 'number';
  
};

export default function CustomInput({
  values,
  placeholder,
  OnChangeText,
  type = 'text',
}: CustomInputProps) {
  const [isSecureText, setIsSecureText] = useState(type === 'password');

  const isPasswordField = type === 'password';

  const icon: keyof typeof MaterialIcons.glyphMap | undefined =
  type === 'password'
    ? 'lock'
    : type === 'email'
    ? 'alternate-email'
    : undefined;

  const keyboardType: KeyboardTypeOptions =
    type === 'email'
      ? 'email-address'
      : type === 'number'
      ? 'numeric'
      : 'default';

  return (
    <View style={styles.wrapper}>
      <View style={styles.inputContainer}>
        {icon && (
          <MaterialIcons name={icon} size={22} color="#666" style={styles.icon} />
        )}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={values}
          onChangeText={OnChangeText}
          keyboardType={keyboardType}
          secureTextEntry={isSecureText}
        />
        {isPasswordField && (
          <TouchableOpacity onPress={() => setIsSecureText(!isSecureText)}>
            <Ionicons
              name={isSecureText ? 'eye' : 'eye-off'}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 48,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    color: '#000',
  },
});