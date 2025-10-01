import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { Baby, Calculator, AlertCircle } from 'lucide-react-native';

export default function PediatricScreen() {
  const [profession, setProfession] = useState<'AP' | 'CCP'>('AP');
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showVitalSignsModal, setShowVitalSignsModal] = useState(false);
  const [age, setAge] = useState('');
  const [ageUnit, setAgeUnit] = useState<'months' | 'years'>('years');

  const calculateWeight = () => {
    if (!age) return null;
    const ageInYears = ageUnit === 'months' ? parseFloat(age) / 12 : parseFloat(age);
    if (ageInYears < 1) return (3.5 + (ageInYears * 12 * 0.5)).toFixed(1);
    if (ageInYears <= 5) return (2 * ageInYears + 8).toFixed(1);
    return (3 * ageInYears + 7).toFixed(1);
  };

  const getVitalSigns = () => {
    if (!age) return null;
    const ageInYears = ageUnit === 'months' ? parseFloat(age) / 12 : parseFloat(age);
    
    if (ageInYears < 1) {
      return {
        hr: '100-160',
        rr: '30-60',
        sbp: '70-90'
      };
    } else if (ageInYears <= 3) {
      return {
        hr: '90-150',
        rr: '24-40',
        sbp: '80-100'
      };
    } else if (ageInYears <= 5) {
      return {
        hr: '80-140',
        rr: '22-34',
        sbp: '90-110'
      };
    } else if (ageInYears <= 12) {
      return {
        hr: '70-120',
        rr: '18-30',
        sbp: '90-120'
      };
    } else {
      return {
        hr: '60-100',
        rr: '12-20',
        sbp: '100-130'
      };
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pediatrics</Text>
        </View>

        <View style={styles.calculationsSection}>
          <Text style={styles.sectionTitle}>Calculations</Text>
          <Text style={styles.sectionSubtitle}>Choose your profession</Text>
          
          <View style={styles.professionButtons}>
            <TouchableOpacity
              style={[styles.profButton, profession === 'AP' && styles.profButtonAP]}
              onPress={() => setProfession('AP')}
            >
              <Text style={[styles.profButtonText, profession === 'AP' && styles.profButtonTextActive]}>
                AP
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.profButton, profession === 'CCP' && styles.profButtonCCP]}
              onPress={() => setProfession('CCP')}
            >
              <Text style={[styles.profButtonText, profession === 'CCP' && styles.profButtonTextActive]}>
                CCP
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonsSection}>
          <Text style={styles.sectionTitle}>Pediatrics Est. Weight</Text>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowWeightModal(true)}
          >
            <Text style={styles.actionButtonText}>EST. WEIGHT</Text>
          </TouchableOpacity>

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Pediatrics Vital Signs</Text>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#E74C3C' }]}
            onPress={() => setShowVitalSignsModal(true)}
          >
            <Text style={styles.actionButtonText}>VITAL SIGNS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showWeightModal}
        onRequestClose={() => setShowWeightModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Estimate Weight</Text>
            
            <TextInput
              style={styles.ageInput}
              value={age}
              onChangeText={setAge}
              placeholder="Enter age"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
            
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setAgeUnit('months')}
              >
                <View style={[styles.radioCircle, ageUnit === 'months' && styles.radioSelected]}>
                  {ageUnit === 'months' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioText}>Months</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setAgeUnit('years')}
              >
                <View style={[styles.radioCircle, ageUnit === 'years' && styles.radioSelected]}>
                  {ageUnit === 'years' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioText}>Years</Text>
              </TouchableOpacity>
            </View>

            {age && (
              <View style={styles.resultBox}>
                <Text style={styles.resultLabel}>Estimated Weight:</Text>
                <Text style={styles.resultValue}>{calculateWeight()} kg</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowWeightModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showVitalSignsModal}
        onRequestClose={() => setShowVitalSignsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Vital Signs</Text>
            
            <TextInput
              style={styles.ageInput}
              value={age}
              onChangeText={setAge}
              placeholder="Enter age"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
            
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setAgeUnit('months')}
              >
                <View style={[styles.radioCircle, ageUnit === 'months' && styles.radioSelected]}>
                  {ageUnit === 'months' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioText}>Months</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setAgeUnit('years')}
              >
                <View style={[styles.radioCircle, ageUnit === 'years' && styles.radioSelected]}>
                  {ageUnit === 'years' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioText}>Years</Text>
              </TouchableOpacity>
            </View>

            {age && getVitalSigns() && (
              <View style={styles.vitalSignsBox}>
                <View style={styles.vitalRow}>
                  <Text style={styles.vitalLabel}>Heart Rate:</Text>
                  <Text style={styles.vitalValue}>{getVitalSigns()?.hr} bpm</Text>
                </View>
                <View style={styles.vitalRow}>
                  <Text style={styles.vitalLabel}>Respiratory Rate:</Text>
                  <Text style={styles.vitalValue}>{getVitalSigns()?.rr} /min</Text>
                </View>
                <View style={styles.vitalRow}>
                  <Text style={styles.vitalLabel}>Systolic BP:</Text>
                  <Text style={styles.vitalValue}>{getVitalSigns()?.sbp} mmHg</Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowVitalSignsModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
  },
  header: {
    backgroundColor: '#E74C3C',
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  calculationsSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
    textAlign: 'center',
  },
  professionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  profButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#666',
  },
  profButtonAP: {
    backgroundColor: '#5B9BD5',
  },
  profButtonCCP: {
    backgroundColor: '#666',
  },
  profButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  profButtonTextActive: {
    color: '#fff',
  },
  buttonsSection: {
    padding: 20,
  },
  actionButton: {
    backgroundColor: '#E91E63',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  ageInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#27AE60',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#27AE60',
  },
  radioText: {
    fontSize: 14,
    color: '#333',
  },
  resultBox: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  vitalSignsBox: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  vitalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  vitalLabel: {
    fontSize: 14,
    color: '#666',
  },
  vitalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});