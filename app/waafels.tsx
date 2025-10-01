import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Heart, Calculator } from 'lucide-react-native';

export default function WAAFELSScreen() {
  const [age, setAge] = useState('');
  const [ageUnit, setAgeUnit] = useState<'months' | 'years'>('years');
  const [profession, setProfession] = useState<'AP' | 'CCP'>('AP');
  const [showResults, setShowResults] = useState(false);

  const calculateWAAFELS = () => {
    if (!age) return;
    
    const ageInYears = ageUnit === 'months' ? parseFloat(age) / 12 : parseFloat(age);
    setShowResults(true);
  };

  const getCalculations = () => {
    if (!age) return null;
    
    const ageInYears = ageUnit === 'months' ? parseFloat(age) / 12 : parseFloat(age);
    const weight = (ageInYears + 4) * 2;
    
    return {
      weight: weight.toFixed(1),
      adrenaline: (weight * 0.01).toFixed(2),
      amiodarone: (weight * 5).toFixed(0),
      fluids: (weight * 20).toFixed(0),
      sga: ageInYears < 1 ? 'Size 1' : ageInYears < 2 ? 'Size 1.5' : ageInYears < 6 ? 'Size 2' : 'Size 2.5',
      energy: (weight * 4).toFixed(0),
      sbp: (70 + (2 * ageInYears)).toFixed(0),
      dextrose: (weight * 2).toFixed(0),
      chestWall: ageInYears < 8 ? '14-16G' : '14G',
      decompression: ageInYears < 8 ? '2nd ICS MCL' : '2nd ICS MCL or 5th ICS MAL'
    };
  };

  const calculations = getCalculations();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>WAAFELSS</Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Enter Age</Text>
          <TextInput
            style={styles.ageInput}
            value={age}
            onChangeText={setAge}
            placeholder="Enter age"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
          
          <Text style={styles.label}>Choose age group</Text>
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

          <TouchableOpacity style={styles.searchButton} onPress={calculateWAAFELS}>
            <Calculator size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.professionButtons}>
          <TouchableOpacity
            style={[styles.profButton, profession === 'AP' && styles.profButtonAP]}
            onPress={() => setProfession('AP')}
          >
            <Text style={[styles.profButtonText, profession === 'AP' && styles.profButtonTextActive]}>
              AP WAFFELS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.profButton, profession === 'CCP' && styles.profButtonCCP]}
            onPress={() => setProfession('CCP')}
          >
            <Text style={[styles.profButtonText, profession === 'CCP' && styles.profButtonTextActive]}>
              CCP WAFFELS
            </Text>
          </TouchableOpacity>
        </View>

        {showResults && calculations && (
          <View style={styles.resultsSection}>
            <TouchableOpacity style={styles.resultItem}>
              <Text style={styles.resultLabel}>Weight</Text>
              <Text style={styles.resultValue}>{calculations.weight} kg</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resultItem}>
              <Text style={styles.resultLabel}>Adrenaline</Text>
              <Text style={styles.resultValue}>{calculations.adrenaline} mg (1:10,000)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resultItem}>
              <Text style={styles.resultLabel}>Amiodarone</Text>
              <Text style={styles.resultValue}>{calculations.amiodarone} mg</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resultItem}>
              <Text style={styles.resultLabel}>Fluids</Text>
              <Text style={styles.resultValue}>{calculations.fluids} mL</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resultItem}>
              <Text style={[styles.resultLabel, { color: '#27AE60' }]}>SGA</Text>
              <Text style={styles.resultValue}>{calculations.sga}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resultItem}>
              <Text style={[styles.resultLabel, { color: '#E74C3C' }]}>Energy</Text>
              <Text style={styles.resultValue}>{calculations.energy} J</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resultItem}>
              <Text style={[styles.resultLabel, { color: '#27AE60' }]}>SBP</Text>
              <Text style={styles.resultValue}>{calculations.sbp} mmHg</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resultItem}>
              <Text style={[styles.resultLabel, { color: '#3498DB' }]}>Dextrose</Text>
              <Text style={styles.resultValue}>{calculations.dextrose} mL (D10)</Text>
            </TouchableOpacity>
            
            {profession === 'CCP' && (
              <>
                <TouchableOpacity style={styles.resultItem}>
                  <Text style={[styles.resultLabel, { color: '#E74C3C' }]}>Chest Wall</Text>
                  <Text style={styles.resultValue}>{calculations.chestWall}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.resultItem}>
                  <Text style={[styles.resultLabel, { color: '#E74C3C' }]}>Decompression</Text>
                  <Text style={styles.resultValue}>{calculations.decompression}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
  inputSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
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
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
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
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E74C3C',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  professionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  profButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  profButtonAP: {
    backgroundColor: '#5B9BD5',
  },
  profButtonCCP: {
    backgroundColor: '#E74C3C',
  },
  profButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  profButtonTextActive: {
    color: '#fff',
  },
  resultsSection: {
    paddingHorizontal: 20,
  },
  resultItem: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3498DB',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 14,
    color: '#666',
  },
});