import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Calculator,
  FileText,
  Activity,
  Siren,
  Bot,
  Settings,
} from 'lucide-react-native';

interface CategoryButton {
  id: string;
  title: string;
  icon: React.ReactNode;
  colors: [string, string];
  route: string;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  
  const categories: CategoryButton[] = [
    {
      id: 'pediatric',
      title: 'Pediatric',
      icon: <Image source={{ uri: 'https://r2-pub.rork.com/generated-images/fd1f887e-0282-4d28-99b5-960fb6aa24e2.png' }} style={styles.buttonImage} />,
      colors: ['#87CEEB', '#5DADE2'],
      route: '/pediatric',
    },
    {
      id: 'scores',
      title: 'Scores',
      icon: <Calculator size={32} color="#fff" />,
      colors: ['#27AE60', '#229954'],
      route: '/scores',
    },
    {
      id: 'waafels',
      title: 'WAAFELS',
      icon: <Image source={{ uri: 'https://r2-pub.rork.com/generated-images/4c78237e-8dbe-4bd2-9cac-110d3a975818.png' }} style={styles.buttonImage} />,
      colors: ['#87CEEB', '#5DADE2'],
      route: '/waafels',
    },
    {
      id: 'files',
      title: 'Files',
      icon: <FileText size={32} color="#fff" />,
      colors: ['#3498DB', '#2980B9'],
      route: '/files',
    },
    {
      id: 'care',
      title: 'Care',
      icon: <Image source={{ uri: 'https://r2-pub.rork.com/generated-images/822ece74-83d6-4af8-ada7-5a26d77cc924.png' }} style={styles.buttonImage} />,
      colors: ['#E74C3C', '#C0392B'],
      route: '/care',
    },
    {
      id: 'flowchart',
      title: 'Flowchart',
      icon: <Image source={{ uri: 'https://r2-pub.rork.com/generated-images/b8077cfa-3ddc-4cfe-b692-46a1f6e55f5a.png' }} style={styles.buttonImage} />,
      colors: ['#3498DB', '#2980B9'],
      route: '/flowchart',
    },
    {
      id: 'rsi',
      title: 'RSI',
      icon: <Image source={{ uri: 'https://r2-pub.rork.com/generated-images/b1d7470d-e14d-432b-8b98-f651236a54a5.png' }} style={styles.buttonImage} />,
      colors: ['#5E4B8C', '#4A3A7A'],
      route: '/rsi',
    },
    {
      id: 'cpr',
      title: 'CPR',
      icon: <Image source={{ uri: 'https://r2-pub.rork.com/generated-images/8732baee-2f89-4de1-b8ea-82d00a628d03.png' }} style={styles.buttonImage} />,
      colors: ['#E74C3C', '#C0392B'],
      route: '/cpr',
    },
    {
      id: 'ai',
      title: 'AI Assistant',
      icon: <Bot size={32} color="#fff" />,
      colors: ['#9B59B6', '#8E44AD'],
      route: '/ai-assistant',
    },
  ];



  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2C5F8D" />
      
      <TouchableOpacity
        style={styles.adminButton}
        onPress={() => router.push('/admin-login' as any)}
        activeOpacity={0.7}
      >
        <Settings size={20} color="#fff" />
      </TouchableOpacity>
      
      <LinearGradient
        colors={['#2C5F8D', '#3A7BC8', '#4A90E2']}
        style={[styles.headerGradient, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Siren size={28} color="#fff" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>SOT Pocket Guide</Text>
            <Text style={styles.headerSubtitle}>Clinical Reference v2.4</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Quick Access</Text>
          <Text style={styles.welcomeSubtitle}>Select a clinical tool or reference</Text>
        </View>
        
        <View style={styles.grid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.buttonWrapper}
              onPress={() => router.push(category.route as any)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={category.colors}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.iconContainer}>
                  {category.icon}
                </View>
                <Text style={styles.buttonText}>{category.title}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.footerCard}>
            <Activity size={16} color="#4A90E2" />
            <Text style={styles.versionText}>Version 2.4 • Updated Jan 2025</Text>
          </View>
          <Text style={styles.copyrightText}>© 2025 SOT Medical Services</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerGradient: {
    paddingTop: 8,
    paddingBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  welcomeSection: {
    paddingVertical: 24,
    paddingHorizontal: 4,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#666',
    fontWeight: '400',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  buttonWrapper: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 4,
  },
  button: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    padding: 16,
  },
  iconContainer: {
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 12,
  },
  versionText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  copyrightText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },

  buttonImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },

  adminButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});