import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Decode QR dari URI gambar menggunakan Google Chart API (online) sebagai fallback
// Untuk offline: scan langsung pakai kamera
async function decodeQRFromImage(uri) {
  // Baca file sebagai base64 lalu kirim ke ZXing online decoder
  // Cara alternatif: gunakan fetch ke API decoder
  try {
    const formData = new FormData();
    formData.append('file', { uri, type: 'image/jpeg', name: 'qr.jpg' });

    const response = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    const data = result?.[0]?.symbol?.[0]?.data;
    if (!data) return null;
    return data;
  } catch {
    return null;
  }
}

export default function QRScanner({ visible, onScanned, onClose }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [facing, setFacing] = useState('back');

  useEffect(() => {
    if (visible) {
      setScanned(false);
      setIsProcessing(false);
    }
  }, [visible]);

  const handleBarCodeScanned = ({ data }) => {
    if (scanned || isProcessing) return;
    setScanned(true);
    parseAndReturn(data);
  };

  const parseAndReturn = (data) => {
    try {
      const parsed = JSON.parse(data);
      onScanned(parsed);
    } catch {
      onScanned(null);
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Izin Ditolak", "Izin akses galeri diperlukan.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled) return;

    setIsProcessing(true);
    try {
      const data = await decodeQRFromImage(result.assets[0].uri);
      if (data) {
        parseAndReturn(data);
      } else {
        Alert.alert(
          "QR Tidak Terbaca",
          "Pastikan gambar jelas dan QR code terlihat penuh. Coba scan langsung dengan kamera."
        );
        setIsProcessing(false);
      }
    } catch {
      Alert.alert("Gagal", "Tidak bisa memproses gambar.");
      setIsProcessing(false);
    }
  };

  if (!permission) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Scan QR Code Kelas</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {!permission.granted ? (
          <View style={styles.permissionBox}>
            <Text style={styles.permissionText}>Izin kamera diperlukan untuk scan QR.</Text>
            <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
              <Text style={styles.permBtnText}>Izinkan Kamera</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <CameraView
              style={styles.camera}
              facing={facing}
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={handleBarCodeScanned}
            >
              <View style={styles.overlay}>
                <View style={styles.frame} />
                <Text style={styles.hint}>Arahkan kamera ke QR Code kelas</Text>
              </View>

              {/* Tombol flip kamera */}
              <TouchableOpacity
                style={styles.flipButton}
                onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')}
              >
                <MaterialIcons name="flip-camera-ios" size={28} color="#fff" />
              </TouchableOpacity>
            </CameraView>

            {/* Footer: pilih dari galeri */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.galleryButton}
                onPress={handlePickImage}
                disabled={isProcessing}
              >
                <MaterialIcons name="photo-library" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.galleryText}>
                  {isProcessing ? 'Memproses gambar...' : 'Pilih Screenshot QR dari Galeri'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, paddingTop: 50, backgroundColor: '#0056A0',
  },
  headerText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  camera: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  frame: { width: 250, height: 250, borderWidth: 3, borderColor: '#00FF88', borderRadius: 12 },
  hint: { color: '#fff', marginTop: 20, fontSize: 14, textAlign: 'center', paddingHorizontal: 20 },
  flipButton: {
    position: 'absolute', bottom: 20, right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 30,
  },
  footer: { backgroundColor: '#111', paddingVertical: 16, paddingHorizontal: 20 },
  galleryButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#0056A0',
    paddingVertical: 14, paddingHorizontal: 20, borderRadius: 8, justifyContent: 'center',
  },
  galleryText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  permissionBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  permissionText: { color: '#fff', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  permBtn: { backgroundColor: '#0056A0', padding: 14, borderRadius: 8 },
  permBtnText: { color: '#fff', fontWeight: 'bold' },
});
