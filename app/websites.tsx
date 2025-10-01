import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { 
  Link, 
  Globe, 
  Mail, 
  Briefcase, 
  Smartphone,
  Monitor,
  Settings,
  GraduationCap,
  FileText,
  BookOpen,
  Shield,
  Calendar,
  Mic,
  Home
} from 'lucide-react-native';

interface WebLink {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
}

export default function WebsitesScreen() {
  const links: WebLink[] = [
    {
      id: '1',
      name: 'Ambulance App Linktree',
      url: 'https://linktr.ee/ambulanceapp',
      icon: <Link size={20} color="#666" />
    },
    {
      id: '2',
      name: 'Oracle - Leave, Salary, etc.',
      url: 'https://oracle.hamad.qa',
      icon: <Globe size={20} color="#666" />
    },
    {
      id: '3',
      name: 'HMC - Email',
      url: 'https://outlook.hamad.qa',
      icon: <Mail size={20} color="#666" />
    },
    {
      id: '4',
      name: 'HMC - OVA',
      url: 'https://ova.hamad.qa',
      icon: <Briefcase size={20} color="#666" />
    },
    {
      id: '5',
      name: 'Hamad App Store',
      url: 'https://appstore.hamad.qa',
      icon: <Smartphone size={20} color="#666" />
    },
    {
      id: '6',
      name: 'HMC Apps - Azure Portal',
      url: 'https://portal.azure.com',
      icon: <Monitor size={20} color="#666" />
    },
    {
      id: '7',
      name: 'HMC - SelfService Portal',
      url: 'https://selfservice.hamad.qa',
      icon: <Settings size={20} color="#666" />
    },
    {
      id: '8',
      name: 'E-Taleem - Training Courses',
      url: 'https://etaleem.hamad.qa',
      icon: <GraduationCap size={20} color="#666" />
    },
    {
      id: '9',
      name: 'Questbase - Training Tests',
      url: 'https://questbase.hamad.qa',
      icon: <FileText size={20} color="#666" />
    },
    {
      id: '10',
      name: 'DHP - CPD Portfolio',
      url: 'https://dhp.moph.gov.qa',
      icon: <BookOpen size={20} color="#666" />
    },
    {
      id: '11',
      name: 'DHP - Licensing Login Page',
      url: 'https://dhp.moph.gov.qa/login',
      icon: <Shield size={20} color="#666" />
    },
    {
      id: '12',
      name: 'Upcoming CPD Activities',
      url: 'https://cpd.hamad.qa',
      icon: <Calendar size={20} color="#666" />
    },
    {
      id: '13',
      name: 'PICU Doc On Call Podcast',
      url: 'https://picudoc.hamad.qa',
      icon: <Mic size={20} color="#666" />
    }
  ];

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Home size={24} color="#fff" />
        <Text style={styles.headerTitle}>Useful Websites</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {links.map(link => (
          <TouchableOpacity
            key={link.id}
            style={styles.linkItem}
            onPress={() => openLink(link.url)}
          >
            <View style={styles.linkIcon}>
              {link.icon}
            </View>
            <Text style={styles.linkText}>{link.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
  },
  header: {
    backgroundColor: '#27AE60',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  linkIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
});