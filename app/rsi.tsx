import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { CheckSquare, Square, AlertTriangle } from 'lucide-react-native';

interface ChecklistItem {
  id: string;
  text: string;
  category: string;
}

export default function RSIScreen() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const checklistItems: ChecklistItem[] = [
    // Preparation
    { id: 'p1', text: 'Suction ready and working', category: 'Preparation' },
    { id: 'p2', text: 'Oxygen source and BVM', category: 'Preparation' },
    { id: 'p3', text: 'Airway equipment (ETT, laryngoscope, bougie)', category: 'Preparation' },
    { id: 'p4', text: 'Monitoring attached (ECG, SpO2, ETCO2)', category: 'Preparation' },
    { id: 'p5', text: 'IV access x2 secured', category: 'Preparation' },
    { id: 'p6', text: 'Backup airway plan ready', category: 'Preparation' },
    
    // Medications
    { id: 'm1', text: 'Induction agent drawn up', category: 'Medications' },
    { id: 'm2', text: 'Paralytic agent drawn up', category: 'Medications' },
    { id: 'm3', text: 'Post-intubation sedation ready', category: 'Medications' },
    { id: 'm4', text: 'Vasopressors available', category: 'Medications' },
    { id: 'm5', text: 'Reversal agents available', category: 'Medications' },
    
    // Team
    { id: 't1', text: 'Roles assigned', category: 'Team' },
    { id: 't2', text: 'Backup plan discussed', category: 'Team' },
    { id: 't3', text: 'Difficult airway cart available', category: 'Team' },
  ];

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const categories = [...new Set(checklistItems.map(item => item.category))];
  const completionRate = Math.round((checkedItems.size / checklistItems.length) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <CheckSquare size={32} color="#5E4B8C" />
          <Text style={styles.headerTitle}>RSI Checklist</Text>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressText}>Completion: {completionRate}%</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${completionRate}%` }]} />
          </View>
          <Text style={styles.progressSubtext}>
            {checkedItems.size} of {checklistItems.length} items checked
          </Text>
        </View>

        {completionRate < 100 && (
          <View style={styles.warningCard}>
            <AlertTriangle size={20} color="#E67E22" />
            <Text style={styles.warningText}>
              Complete all items before proceeding with RSI
            </Text>
          </View>
        )}

        {categories.map(category => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {checklistItems
              .filter(item => item.category === category)
              .map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.checklistItem}
                  onPress={() => toggleItem(item.id)}
                >
                  {checkedItems.has(item.id) ? (
                    <CheckSquare size={24} color="#27AE60" />
                  ) : (
                    <Square size={24} color="#999" />
                  )}
                  <Text style={[
                    styles.checklistText,
                    checkedItems.has(item.id) && styles.checkedText
                  ]}>
                    {item.text}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        ))}

        <TouchableOpacity 
          style={styles.resetButton}
          onPress={() => setCheckedItems(new Set())}
        >
          <Text style={styles.resetButtonText}>Reset Checklist</Text>
        </TouchableOpacity>
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
  progressCard: {
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
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#27AE60',
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 13,
    color: '#666',
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#856404',
    marginLeft: 8,
  },
  categorySection: {
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
    color: '#5E4B8C',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  checklistText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  checkedText: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  resetButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});