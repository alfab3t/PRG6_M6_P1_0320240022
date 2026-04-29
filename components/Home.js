import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View, Text, SafeAreaView, StyleSheet,
  TouchableOpacity, ScrollView, FlatList, Alert, TextInput
} from 'react-native';
import KartuProfil from './KartuProfil';

// Data awal (Initial State)
const initialHistory = [
  { id: '1', course: 'Web Programming', date: '2026-03-01', status: 'Absent' },
  { id: '2', course: 'Database System', date: '2026-03-02', status: 'Present' },
];

const studentData = {
  nama: 'Djohan Bagus Artya Wicaksana',
  nim: '0320240022',
  prodi: 'Informatika-2A',
};

const todayClass = {
  course: 'Mobile Programming',
  time: '08:00 - 10:00',
  room: 'Lab 3',
};

const Home = () => {
  const [historyData, setHistoryData] = useState(initialHistory);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState('Memuat jam...');
  const [note, setNote] = useState('');
  const noteInputRef = useRef(null);
  const attendanceStats = useMemo(() => {
    console.log('Menghitung ulang statistik kehadiran...');
    const presentCount = historyData.filter((item) => item.status === 'Present').length;
    const absentCount = historyData.filter((item) => item.status === 'Absent').length;
    return { totalPresent: presentCount, totalAbsent: absentCount };
  }, [historyData]);
  useEffect(() => {
    const timer = setInterval(() => {
      const timeString = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      setCurrentTime(timeString);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    if (isCheckedIn) {
      Alert.alert('Perhatian', 'Anda sudah melakukan Check In.');
      return;
    }

    if (note.trim() === '') {
      Alert.alert('Peringatan', 'Catatan kehadiran wajib diisi!');
      noteInputRef.current.focus();
      return;
    }

    const newAttendance = {
      id: Date.now().toString(),
      course: 'Mobile Programming',
      date: new Date().toLocaleDateString('id-ID'),
      status: 'Present',
    };

    setHistoryData([newAttendance, ...historyData]);
    setIsCheckedIn(true);
    Alert.alert('Sukses', `Berhasil Check In pada pukul ${currentTime}`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View>
        <Text style={styles.historyCourseName}>{item.course}</Text>
        <Text style={styles.historyDate}>{item.date}</Text>
      </View>
      <Text style={[
        styles.historyStatus,
        item.status === 'Present' ? styles.statusPresent : styles.statusAbsent
      ]}>
        {item.status}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Attendance App</Text>
            <Text style={styles.clockText}>{currentTime}</Text>
          </View>
        </View>


        <KartuProfil student={studentData} />


        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Class</Text>
          <Text style={styles.classInfo}>{todayClass.course}</Text>
          <Text style={styles.classInfo}>{todayClass.time}</Text>
          <Text style={styles.classInfo}>{todayClass.room}</Text>

          {!isCheckedIn && (
            <TextInput
              ref={noteInputRef}
              style={styles.inputCatatan}
              placeholder="Tulis catatan (cth: Hadir lab)"
              value={note}
              onChangeText={setNote}
            />
          )}

          <TouchableOpacity
            style={[styles.button, isCheckedIn ? styles.buttonDisabled : styles.buttonActive]}
            onPress={handleCheckIn}
            disabled={isCheckedIn}
          >
            <Text style={styles.buttonText}>
              {isCheckedIn ? 'CHECKED IN' : 'CHECK IN'}
            </Text>
          </TouchableOpacity>
        </View>


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


        <View style={styles.card}>
          <Text style={styles.cardTitle}>Attendance History</Text>
          <FlatList
            data={historyData}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  clockText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    fontVariant: ['tabular-nums'],
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  classInfo: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  button: {
    marginTop: 12,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#007AFF',
  },
  buttonDisabled: {
    backgroundColor: '#A8C4FF',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyCourseName: {
    fontSize: 14,
    color: '#333',
  },
  historyDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  historyStatus: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  statusPresent: {
    color: '#2E7D32',
  },
  statusAbsent: {
    color: '#C62828',
  },
  inputCatatan: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 15,
    backgroundColor: '#fafafa',
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
  },
  statLabel: {
    fontSize: 14,
    color: 'gray',
  },
});
