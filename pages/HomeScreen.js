import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
  View, Text, SafeAreaView, StyleSheet,
  TouchableOpacity, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import QRScanner from '../components/QRScanner';

const HomeScreen = ({ navigation }) => {
  const { userData, logout } = useContext(AuthContext);

  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState('Memuat jam...');
  const [isPosting, setIsPosting] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [kelasInfo, setKelasInfo] = useState(null); // data dari QR

  const BASE_URL = "http://10.1.11.115:8080/api/presensi";

  const attendanceStats = useMemo(() => ({ totalPresent: 12, totalAbsent: 2 }), []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('id-ID', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dipanggil setelah QR berhasil di-scan
  const handleQRScanned = async (qrData) => {
    setShowScanner(false);

    if (!qrData) {
      Alert.alert("QR Tidak Valid", "Format QR Code tidak dikenali.");
      return;
    }

    if (isCheckedIn) {
      Alert.alert("Perhatian", "Anda sudah Check In.");
      return;
    }

    setKelasInfo(qrData);
    setIsPosting(true);

    const now = new Date();
    const payload = {
      kodeMk: qrData.kodeMk,
      course: qrData.course,
      status: "Present",
      nimMhs: userData.mhsNim,
      pertemuanKe: qrData.pertemuanKe || 1,
      date: now.toISOString().split('T')[0],
      jamPresensi: now.toLocaleTimeString('id-ID', { hour12: false }),
      ruangan: qrData.ruangan,
      dosenPengampu: qrData.dosenPengampu,
    };

    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setIsCheckedIn(true);
        Alert.alert("Berhasil!", `Presensi ${qrData.course} tercatat.`, [
          { text: "Lihat Riwayat", onPress: () => navigation.navigate('History') },
          { text: "OK" }
        ]);
      } else {
        Alert.alert("Gagal", result.message || "Terjadi kesalahan di server.");
      }
    } catch (error) {
      Alert.alert("Error Jaringan", "Pastikan IP Laptop benar dan Spring Boot berjalan.");
      console.error(error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Attendance App</Text>
          <Text style={styles.clockText}>{currentTime}</Text>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Student Card */}
        <View style={styles.card}>
          <View style={styles.icon}>
            <MaterialIcons name="person" size={40} color="#555" />
          </View>
          <View>
            <Text style={styles.name}>{userData.mhsName}</Text>
            <Text>NIM : {userData.mhsNim}</Text>
            <Text>Class : {userData.prodi}</Text>
          </View>
        </View>

        {/* Today's Class */}
        <View style={styles.classCard}>
          <Text style={styles.subtitle}>Today's Class</Text>

          {kelasInfo ? (
            // Tampilkan info kelas dari hasil scan QR
            <>
              <Text style={styles.kelasNama}>{kelasInfo.course} ({kelasInfo.kodeMk})</Text>
              <View style={styles.kelasRow}>
                <MaterialIcons name="room" size={16} color="#666" />
                <Text style={styles.kelasDetail}> {kelasInfo.ruangan}</Text>
              </View>
              <View style={styles.kelasRow}>
                <MaterialIcons name="person-outline" size={16} color="#666" />
                <Text style={styles.kelasDetail}> {kelasInfo.dosenPengampu}</Text>
              </View>
            </>
          ) : (
            <Text style={styles.scanHint}>Scan QR Code untuk melihat info kelas</Text>
          )}

          {isPosting ? (
            <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 15 }} />
          ) : (
            <TouchableOpacity
              style={[styles.button, isCheckedIn ? styles.buttonDisabled : styles.buttonActive]}
              onPress={() => !isCheckedIn && setShowScanner(true)}
              disabled={isCheckedIn}
            >
              <MaterialIcons
                name={isCheckedIn ? "check-circle" : "qr-code-scanner"}
                size={20} color="#fff" style={{ marginRight: 8 }}
              />
              <Text style={styles.buttonText}>
                {isCheckedIn ? 'CHECKED IN' : 'SCAN QR & CHECK IN'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{attendanceStats.totalPresent}</Text>
            <Text style={styles.statLabel}>Total Present</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: 'red' }]}>{attendanceStats.totalAbsent}</Text>
            <Text style={styles.statLabel}>Total Absent</Text>
          </View>
        </View>
      </ScrollView>

      {/* QR Scanner Modal */}
      <QRScanner
        visible={showScanner}
        onScanned={handleQRScanned}
        onClose={() => setShowScanner(false)}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  clockText: { fontSize: 16, fontWeight: 'bold', color: '#0056A0' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2 },
  icon: { marginRight: 15 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  classCard: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2 },
  subtitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  scanHint: { color: '#aaa', fontSize: 13, marginBottom: 4 },
  kelasNama: { fontSize: 15, fontWeight: 'bold', color: '#0056A0', marginBottom: 6 },
  kelasRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  kelasDetail: { fontSize: 13, color: '#555' },
  button: { marginTop: 12, padding: 14, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  buttonActive: { backgroundColor: '#0056A0' },
  buttonDisabled: { backgroundColor: '#A8C4FF' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
  statsCard: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white', padding: 15, borderRadius: 10, elevation: 2 },
  statBox: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: 'green' },
  statLabel: { fontSize: 14, color: 'gray' },
  logoutButton: { marginLeft: 12, backgroundColor: '#d9534f', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6 },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});
