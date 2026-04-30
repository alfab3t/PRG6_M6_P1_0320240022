import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

// Data kelas yang bisa di-generate QR-nya
const DAFTAR_KELAS = [
  { kodeMk: 'TRPL205', course: 'Mobile Programming', ruangan: 'Lab Komputer 3', dosenPengampu: 'Tim Dosen TRPL', pertemuanKe: 6 },
  { kodeMk: 'TRPL201', course: 'Web Programming', ruangan: 'Lab Komputer 1', dosenPengampu: 'Ibu Rina', pertemuanKe: 6 },
  { kodeMk: 'TRPL203', course: 'Database System', ruangan: 'Lab Komputer 2', dosenPengampu: 'Bpk. Andi', pertemuanKe: 6 },
  { kodeMk: 'TRPL204', course: 'Computer Network', ruangan: 'Lab Komputer 1', dosenPengampu: 'Ibu Siti', pertemuanKe: 6 },
  { kodeMk: 'TRPL202', course: 'Software Engineering', ruangan: 'Lab Komputer 2', dosenPengampu: 'Bpk. Joko', pertemuanKe: 6 },
];

export default function QRGeneratorScreen() {
  const [selected, setSelected] = useState(DAFTAR_KELAS[0]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>QR Code Kelas</Text>
        <Text style={styles.subtitle}>Pilih kelas untuk generate QR</Text>

        {/* Pilihan kelas */}
        {DAFTAR_KELAS.map((kelas) => (
          <TouchableOpacity
            key={kelas.kodeMk}
            style={[styles.kelasItem, selected.kodeMk === kelas.kodeMk && styles.kelasSelected]}
            onPress={() => setSelected(kelas)}
          >
            <Text style={[styles.kelasText, selected.kodeMk === kelas.kodeMk && styles.kelasTextSelected]}>
              {kelas.course}
            </Text>
            <Text style={styles.kelasKode}>{kelas.kodeMk}</Text>
          </TouchableOpacity>
        ))}

        {/* QR Code */}
        <View style={styles.qrBox}>
          <QRCode
            value={JSON.stringify(selected)}
            size={220}
            color="#000"
            backgroundColor="#fff"
          />
          <Text style={styles.qrLabel}>{selected.course}</Text>
          <Text style={styles.qrSub}>{selected.ruangan} • {selected.dosenPengampu}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 20, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#888', marginBottom: 16 },
  kelasItem: {
    width: '100%', padding: 12, borderRadius: 8, backgroundColor: 'white',
    marginBottom: 8, elevation: 1, borderWidth: 2, borderColor: 'transparent',
  },
  kelasSelected: { borderColor: '#0056A0', backgroundColor: '#EEF4FF' },
  kelasText: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  kelasTextSelected: { color: '#0056A0' },
  kelasKode: { fontSize: 12, color: '#888', marginTop: 2 },
  qrBox: {
    marginTop: 24, backgroundColor: 'white', padding: 24,
    borderRadius: 16, alignItems: 'center', elevation: 4,
  },
  qrLabel: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 16 },
  qrSub: { fontSize: 12, color: '#888', marginTop: 4 },
});
