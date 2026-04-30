import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, SafeAreaView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = "http://10.1.11.115:8080/api/user/login";

  const handleLogin = async () => {
    if (!nim.trim() || !password.trim()) {
      Alert.alert("Peringatan", "NIM dan Password wajib diisi!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authcode': 'astratech@123',
        },
        body: JSON.stringify({ nim, password }),
      });

      const result = await response.json();

      if (result.code === 200) {
        await login(result.data);
      } else {
        Alert.alert("Login Gagal", result.message || "NIM atau Password salah.");
      }
    } catch (error) {
      Alert.alert("Error Jaringan", "Pastikan IP Laptop benar dan Spring Boot berjalan.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <MaterialIcons name="school" size={60} color="#0056A0" style={styles.icon} />
        <Text style={styles.title}>Attendance App</Text>
        <Text style={styles.subtitle}>Silakan login untuk melanjutkan</Text>

        <TextInput
          style={styles.input}
          placeholder="NIM"
          value={nim}
          onChangeText={setNim}
          keyboardType="numeric"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {isLoading ? (
          <ActivityIndicator size="large" color="#0056A0" style={{ marginTop: 15 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', justifyContent: 'center' },
  card: { backgroundColor: 'white', margin: 20, padding: 30, borderRadius: 12, elevation: 4, alignItems: 'center' },
  icon: { marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#888', marginBottom: 24 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 15 },
  button: { width: '100%', backgroundColor: '#0056A0', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15, letterSpacing: 1 },
});
