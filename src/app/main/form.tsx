import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { DEFAULT_HEWAN_STATUS, HEWAN_STATUS_OPTIONS, getHewanStatusLabel } from '../../constants/hewan';
import type { HewanStatus } from '../../domain/entities/Hewan';
import { useHewanViewModel } from '../../hooks/useHewanViewModel';

export default function AddHewanScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [nama, setNama] = useState('');
  const [jenis, setJenis] = useState('');
  const [harga, setHarga] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState(new Date());
  const [status, setStatus] = useState<HewanStatus>(DEFAULT_HEWAN_STATUS);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStatusOptions, setShowStatusOptions] = useState(false);

  const { addHewan, updateHewan, getHewanById, loading, error } = useHewanViewModel();
  const router = useRouter();
  const hewanId = id ? Number(id) : null;
  const isEditMode = typeof hewanId === 'number' && Number.isInteger(hewanId) && hewanId > 0;

  const parseDateString = (value?: string) => {
    if (!value) return new Date();

    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  };

  const navigateToMain = () => {
    router.replace('/main');
  };

  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const onChangeDate = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setTanggalLahir(selectedDate);
    }
  };

  useEffect(() => {
    if (!isEditMode || !hewanId) return;

    let isMounted = true;

    const loadHewanDetail = async () => {
      const selectedHewan = await getHewanById(hewanId);
      if (!selectedHewan || !isMounted) return;

      setNama(selectedHewan.nama);
      setJenis(selectedHewan.jenis);
      setHarga(String(selectedHewan.harga));
      setTanggalLahir(parseDateString(selectedHewan.tanggal_lahir));
      setStatus(selectedHewan.status ?? DEFAULT_HEWAN_STATUS);
    };

    loadHewanDetail();

    return () => {
      isMounted = false;
    };
  }, [getHewanById, hewanId, isEditMode]);

  const onSubmit = () => {
    const cleanNama = nama.trim();
    const cleanJenis = jenis.trim();
    const numericHarga = Number(harga);

    if (!cleanNama) {
      Alert.alert('Validasi Gagal', 'Nama hewan wajib diisi');
      return;
    }

    if (!cleanJenis) {
      Alert.alert('Validasi Gagal', 'Jenis hewan wajib diisi');
      return;
    }

    if (!harga || isNaN(numericHarga) || numericHarga <= 0) {
      Alert.alert('Validasi Gagal', 'Harga harus berupa angka lebih besar dari 0');
      return;
    }

    const payload = {
      nama: cleanNama,
      jenis: cleanJenis,
      harga: numericHarga,
      tanggal_lahir: formatDateString(tanggalLahir),
      status,
    };

    if (isEditMode && hewanId) {
      updateHewan(hewanId, payload, navigateToMain);
      return;
    }

    addHewan(payload, navigateToMain);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ThemedView style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={navigateToMain}
              disabled={loading}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.backButtonText}>Kembali</ThemedText>
            </TouchableOpacity>
            <ThemedText type="title" style={styles.headerTitle}>
              {isEditMode ? 'Edit Ternak' : 'Tambah Ternak Baru'}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.form}>
            {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

            <TextInput
              style={styles.input}
              placeholder="Nama Hewan"
              placeholderTextColor="#94a3b8"
              value={nama}
              onChangeText={setNama}
            />

            <TextInput
              style={styles.input}
              placeholder="Jenis (contoh: Sapi Limosin)"
              placeholderTextColor="#94a3b8"
              value={jenis}
              onChangeText={setJenis}
            />

            <TextInput
              style={styles.input}
              placeholder="Harga (Rupiah)"
              placeholderTextColor="#94a3b8"
              keyboardType="number-pad"
              value={harga}
              onChangeText={(text) => {
                setHarga(text.replace(/[^0-9]/g, ''));
              }}
            />

            <TouchableOpacity
              style={styles.dateInputButton}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.dateText}>
                Tanggal Lahir: {formatDateString(tanggalLahir)}
              </ThemedText>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={tanggalLahir}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeDate}
                maximumDate={new Date()}
              />
            )}

            <ThemedView style={styles.dropdownGroup}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowStatusOptions((current) => !current)}
                activeOpacity={0.7}
              >
                <ThemedText style={styles.dropdownText}>
                  Status: {getHewanStatusLabel(status)}
                </ThemedText>
                <ThemedText style={styles.dropdownArrow}>v</ThemedText>
              </TouchableOpacity>

              {showStatusOptions && (
                <ThemedView style={styles.dropdownMenu}>
                  {HEWAN_STATUS_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.dropdownOption,
                        option.value === status && styles.dropdownOptionActive,
                      ]}
                      onPress={() => {
                        setStatus(option.value);
                        setShowStatusOptions(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <ThemedText
                        style={[
                          styles.dropdownOptionText,
                          option.value === status && styles.dropdownOptionTextActive,
                        ]}
                      >
                        {option.label}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </ThemedView>
              )}
            </ThemedView>

            <TouchableOpacity style={styles.submitButton} onPress={onSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.submitButtonText}>
                  {isEditMode ? 'Simpan Perubahan' : 'Simpan ke Database'}
                </ThemedText>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={navigateToMain}
              disabled={loading}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.cancelButtonText}>Batal</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  header: {
    marginVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    flex: 1,
  },
  backButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButtonText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
  },
  form: { gap: 16 },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0f172a',
  },
  dateInputButton: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#334155',
  },
  dropdownGroup: {
    gap: 8,
    backgroundColor: 'transparent',
  },
  dropdownButton: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#334155',
  },
  dropdownArrow: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '700',
  },
  dropdownMenu: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownOptionActive: {
    backgroundColor: '#e0f2fe',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#334155',
  },
  dropdownOptionTextActive: {
    color: '#0369a1',
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: '#0284c7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  cancelButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: { color: '#ef4444', textAlign: 'center', fontWeight: '600' },
});
