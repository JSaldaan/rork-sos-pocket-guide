import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Heart, Activity, Thermometer, Droplets, Wind } from 'lucide-react-native';

export default function CareScreen() {
  const vitalSigns = [
    {
      category: 'Adult',
      ranges: [
        { name: 'Heart Rate', value: '60-100 bpm', icon: <Heart size={20} color="#E74C3C" /> },
        { name: 'Blood Pressure', value: '120/80 mmHg', icon: <Activity size={20} color="#3498DB" /> },
        { name: 'Respiratory Rate', value: '12-20 /min', icon: <Wind size={20} color="#27AE60" /> },
        { name: 'Temperature', value: '36.5-37.5°C', icon: <Thermometer size={20} color="#E67E22" /> },
        { name: 'SpO2', value: '>95%', icon: <Droplets size={20} color="#9B59B6" /> },
      ]
    },
    {
      category: 'Pediatric (1-12 years)',
      ranges: [
        { name: 'Heart Rate', value: '70-120 bpm', icon: <Heart size={20} color="#E74C3C" /> },
        { name: 'Blood Pressure', value: '90-110/60-80', icon: <Activity size={20} color="#3498DB" /> },
        { name: 'Respiratory Rate', value: '20-30 /min', icon: <Wind size={20} color="#27AE60" /> },
        { name: 'Temperature', value: '36.5-37.5°C', icon: <Thermometer size={20} color="#E67E22" /> },
        { name: 'SpO2', value: '>95%', icon: <Droplets size={20} color="#9B59B6" /> },
      ]
    },
    {
      category: 'Infant (<1 year)',
      ranges: [
        { name: 'Heart Rate', value: '100-160 bpm', icon: <Heart size={20} color="#E74C3C" /> },
        { name: 'Blood Pressure', value: '70-100/50-70', icon: <Activity size={20} color="#3498DB" /> },
        { name: 'Respiratory Rate', value: '30-60 /min', icon: <Wind size={20} color="#27AE60" /> },
        { name: 'Temperature', value: '36.5-37.5°C', icon: <Thermometer size={20} color="#E67E22" /> },
        { name: 'SpO2', value: '>95%', icon: <Droplets size={20} color="#9B59B6" /> },
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Heart size={32} color="#E74C3C" />
          <Text style={styles.headerTitle}>Patient Care</Text>
        </View>

        <Text style={styles.sectionTitle}>Normal Vital Signs</Text>

        {vitalSigns.map((category, index) => (
          <View key={index} style={styles.categoryCard}>
            <Text style={styles.categoryTitle}>{category.category}</Text>
            {category.ranges.map((vital, vIndex) => (
              <View key={vIndex} style={styles.vitalRow}>
                <View style={styles.vitalLeft}>
                  {vital.icon}
                  <Text style={styles.vitalName}>{vital.name}</Text>
                </View>
                <Text style={styles.vitalValue}>{vital.value}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.quickActionsCard}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Primary Survey</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Secondary Survey</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Pain Assessment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Neuro Check</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  vitalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  vitalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vitalName: {
    fontSize: 14,
    color: '#666',
  },
  vitalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  quickActionsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
});