import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Clock, DollarSign, TrendingUp } from 'lucide-react-native';

export default function OvertimeScreen() {
  const [regularHours, setRegularHours] = useState('40');
  const [overtimeHours, setOvertimeHours] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  const calculatePay = () => {
    const regular = parseFloat(regularHours) || 0;
    const overtime = parseFloat(overtimeHours) || 0;
    const rate = parseFloat(hourlyRate) || 0;

    const regularPay = regular * rate;
    const overtimePay = overtime * rate * 1.5;
    const totalPay = regularPay + overtimePay;

    return {
      regularPay: regularPay.toFixed(2),
      overtimePay: overtimePay.toFixed(2),
      totalPay: totalPay.toFixed(2),
      totalHours: (regular + overtime).toFixed(1),
    };
  };

  const pay = calculatePay();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Clock size={32} color="#3498DB" />
          <Text style={styles.headerTitle}>Overtime Calculator</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hours Worked</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Regular Hours</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={regularHours}
                onChangeText={setRegularHours}
                placeholder="40"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              <Text style={styles.inputSuffix}>hrs</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Overtime Hours</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={overtimeHours}
                onChangeText={setOvertimeHours}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              <Text style={styles.inputSuffix}>hrs</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hourly Rate</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={[styles.input, { paddingLeft: 24 }]}
                value={hourlyRate}
                onChangeText={setHourlyRate}
                placeholder="0.00"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              <Text style={styles.inputSuffix}>/hr</Text>
            </View>
          </View>
        </View>

        {hourlyRate && (
          <View style={styles.resultsCard}>
            <View style={styles.resultsHeader}>
              <DollarSign size={24} color="#27AE60" />
              <Text style={styles.resultsTitle}>Pay Breakdown</Text>
            </View>

            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Regular Pay</Text>
              <Text style={styles.resultValue}>${pay.regularPay}</Text>
            </View>

            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Overtime Pay (1.5x)</Text>
              <Text style={styles.resultValue}>${pay.overtimePay}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.resultItem}>
              <Text style={styles.totalLabel}>Total Pay</Text>
              <Text style={styles.totalValue}>${pay.totalPay}</Text>
            </View>

            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Total Hours</Text>
              <Text style={styles.resultValue}>{pay.totalHours} hrs</Text>
            </View>
          </View>
        )}

        <View style={styles.infoCard}>
          <TrendingUp size={20} color="#3498DB" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Overtime Rules</Text>
            <Text style={styles.infoText}>
              • Standard overtime: 1.5x regular rate{'\n'}
              • Applies after 40 hours/week{'\n'}
              • Some states have daily overtime rules
            </Text>
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
    position: 'relative',
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
  currencySymbol: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
    fontSize: 16,
    color: '#666',
  },
  inputSuffix: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  resultsCard: {
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
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  resultLabel: {
    fontSize: 15,
    color: '#666',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1565C0',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#1565C0',
    lineHeight: 20,
  },
});