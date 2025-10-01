import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Plane, Clock, AlertCircle } from 'lucide-react-native';

export default function HOSScreen() {
  const [onDutyHours, setOnDutyHours] = useState('');
  const [drivingHours, setDrivingHours] = useState('');
  const [breakTime, setBreakTime] = useState('');

  const calculateRemaining = () => {
    const onDuty = parseFloat(onDutyHours) || 0;
    const driving = parseFloat(drivingHours) || 0;
    const breakMin = parseFloat(breakTime) || 0;

    return {
      remainingOnDuty: Math.max(0, 14 - onDuty),
      remainingDriving: Math.max(0, 11 - driving),
      breakRequired: driving >= 8 && breakMin < 30,
      canContinue: onDuty < 14 && driving < 11,
    };
  };

  const status = calculateRemaining();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Plane size={32} color="#5E4B8C" />
          <Text style={styles.headerTitle}>Hours of Service</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Status</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>On-Duty Hours Today</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={onDutyHours}
                onChangeText={setOnDutyHours}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              <Text style={styles.inputSuffix}>hours</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Driving Hours Today</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={drivingHours}
                onChangeText={setDrivingHours}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              <Text style={styles.inputSuffix}>hours</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Break Time Taken</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={breakTime}
                onChangeText={setBreakTime}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              <Text style={styles.inputSuffix}>minutes</Text>
            </View>
          </View>
        </View>

        {(onDutyHours || drivingHours) && (
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Clock size={24} color="#3498DB" />
              <Text style={styles.statusTitle}>Remaining Time</Text>
            </View>

            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>On-Duty Time Left</Text>
              <Text style={[
                styles.statusValue,
                status.remainingOnDuty <= 2 && styles.warningText
              ]}>
                {status.remainingOnDuty.toFixed(1)} hours
              </Text>
            </View>

            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Driving Time Left</Text>
              <Text style={[
                styles.statusValue,
                status.remainingDriving <= 2 && styles.warningText
              ]}>
                {status.remainingDriving.toFixed(1)} hours
              </Text>
            </View>

            {status.breakRequired && (
              <View style={styles.alertCard}>
                <AlertCircle size={20} color="#E67E22" />
                <Text style={styles.alertText}>
                  30-minute break required after 8 hours of driving
                </Text>
              </View>
            )}

            <View style={[
              styles.complianceCard,
              { backgroundColor: status.canContinue ? '#D4EDDA' : '#F8D7DA' }
            ]}>
              <Text style={[
                styles.complianceText,
                { color: status.canContinue ? '#155724' : '#721C24' }
              ]}>
                {status.canContinue ? '✓ Within HOS limits' : '✗ HOS limit reached'}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.rulesCard}>
          <Text style={styles.rulesTitle}>DOT HOS Rules</Text>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleBullet}>•</Text>
            <Text style={styles.ruleText}>14-hour on-duty limit</Text>
          </View>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleBullet}>•</Text>
            <Text style={styles.ruleText}>11-hour driving limit</Text>
          </View>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleBullet}>•</Text>
            <Text style={styles.ruleText}>30-minute break required after 8 hours</Text>
          </View>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleBullet}>•</Text>
            <Text style={styles.ruleText}>10 consecutive hours off-duty required</Text>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  inputSuffix: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusLabel: {
    fontSize: 15,
    color: '#666',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  warningText: {
    color: '#E67E22',
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  alertText: {
    flex: 1,
    fontSize: 13,
    color: '#856404',
    marginLeft: 8,
  },
  complianceCard: {
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  complianceText: {
    fontSize: 14,
    fontWeight: '600',
  },
  rulesCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  ruleItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  ruleBullet: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
});