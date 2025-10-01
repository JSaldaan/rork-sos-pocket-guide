import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Platform,
} from 'react-native';
import { Phone, AlertCircle, MapPin, Clock } from 'lucide-react-native';

interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  description: string;
  available: string;
  priority: 'high' | 'medium' | 'low';
}

export default function ASCallScreen() {
  const contacts: EmergencyContact[] = [
    { id: '1', name: 'Medical Control', number: '1-800-MED-CTRL', description: 'Direct medical guidance', available: '24/7', priority: 'high' },
    { id: '2', name: 'Poison Control', number: '1-800-222-1222', description: 'Toxicology consultation', available: '24/7', priority: 'high' },
    { id: '3', name: 'Trauma Center', number: '555-TRAUMA-1', description: 'Level 1 trauma center', available: '24/7', priority: 'high' },
    { id: '4', name: 'Pediatric Hospital', number: '555-PEDS-911', description: 'Pediatric emergency', available: '24/7', priority: 'medium' },
    { id: '5', name: 'Burn Center', number: '555-BURN-CTR', description: 'Specialized burn care', available: '24/7', priority: 'medium' },
    { id: '6', name: 'Stroke Center', number: '555-STROKE-1', description: 'Comprehensive stroke center', available: '24/7', priority: 'high' },
    { id: '7', name: 'Cardiac Cath Lab', number: '555-CATH-LAB', description: 'STEMI activation', available: '24/7', priority: 'high' },
    { id: '8', name: 'Air Medical', number: '555-HELI-MED', description: 'Helicopter transport', available: 'Weather permitting', priority: 'medium' },
  ];

  const makeCall = (number: string) => {
    const phoneNumber = number.replace(/[^0-9]/g, '');
    const url = Platform.select({
      ios: `tel:${phoneNumber}`,
      android: `tel:${phoneNumber}`,
      default: `tel:${phoneNumber}`,
    });
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('Error making call:', err));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#E74C3C';
      case 'medium': return '#F39C12';
      case 'low': return '#95A5A6';
      default: return '#95A5A6';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Phone size={32} color="#F39C12" />
          <Text style={styles.headerTitle}>AS-Call Directory</Text>
        </View>

        <View style={styles.alertCard}>
          <AlertCircle size={20} color="#E74C3C" />
          <Text style={styles.alertText}>
            Emergency contact directory - Verify numbers with local protocols
          </Text>
        </View>

        <View style={styles.contactList}>
          {contacts.map(contact => (
            <TouchableOpacity
              key={contact.id}
              style={styles.contactCard}
              onPress={() => makeCall(contact.number)}
            >
              <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(contact.priority) }]} />
              
              <View style={styles.contactContent}>
                <View style={styles.contactHeader}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(contact.priority) + '20' }]}>
                    <Text style={[styles.priorityText, { color: getPriorityColor(contact.priority) }]}>
                      {contact.priority.toUpperCase()}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.contactNumber}>{contact.number}</Text>
                <Text style={styles.contactDescription}>{contact.description}</Text>
                
                <View style={styles.availabilityRow}>
                  <Clock size={14} color="#666" />
                  <Text style={styles.availabilityText}>{contact.available}</Text>
                </View>
              </View>

              <View style={styles.callButton}>
                <Phone size={24} color="#fff" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoCard}>
          <MapPin size={20} color="#3498DB" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Location Services</Text>
            <Text style={styles.infoText}>
              Ensure location services are enabled for accurate facility routing
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
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  alertText: {
    flex: 1,
    fontSize: 13,
    color: '#C62828',
    marginLeft: 8,
  },
  contactList: {
    gap: 12,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  priorityIndicator: {
    width: 4,
    height: '100%',
    position: 'absolute',
    left: 0,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  contactContent: {
    flex: 1,
    marginLeft: 8,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  contactNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F39C12',
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  availabilityText: {
    fontSize: 12,
    color: '#666',
  },
  callButton: {
    backgroundColor: '#27AE60',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#1565C0',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#1565C0',
  },
});