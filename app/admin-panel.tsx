import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Save,
  X,
  Upload,
  FileText,
} from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminPanelScreen() {
  const insets = useSafeAreaInsets();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    icon: '',
    colors: ['#3498DB', '#2980B9'],
    route: '',
  });

  const categoriesQuery = trpc.admin.content.getCategories.useQuery();
  const addCategoryMutation = trpc.admin.content.addCategory.useMutation();
  const updateCategoryMutation = trpc.admin.content.updateCategory.useMutation();
  const deleteCategoryMutation = trpc.admin.content.deleteCategory.useMutation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('adminToken');
    if (!token) {
      router.replace('/admin-login' as any);
      return;
    }
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('adminToken');
          await AsyncStorage.removeItem('adminUser');
          router.replace('/admin-login' as any);
        },
      },
    ]);
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      id: '',
      title: '',
      icon: '',
      colors: ['#3498DB', '#2980B9'],
      route: '',
    });
    setModalVisible(true);
  };

  const openEditModal = (category: any) => {
    setEditingCategory(category);
    setFormData({
      id: category.id,
      title: category.title,
      icon: category.icon,
      colors: category.colors,
      route: category.route,
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.id || !formData.title || !formData.route) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategoryMutation.mutateAsync(formData);
        Alert.alert('Success', 'Category updated successfully');
      } else {
        await addCategoryMutation.mutateAsync(formData);
        Alert.alert('Success', 'Category added successfully');
      }
      setModalVisible(false);
      categoriesQuery.refetch();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save category');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategoryMutation.mutateAsync({ id });
              Alert.alert('Success', 'Category deleted successfully');
              categoriesQuery.refetch();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete category');
            }
          },
        },
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2C5F8D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2C5F8D', '#3A7BC8']}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Settings size={24} color="#fff" />
            <Text style={styles.headerTitle}>Admin Panel</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <LogOut size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={openAddModal} style={styles.addButton}>
              <Plus size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {categoriesQuery.isLoading ? (
            <ActivityIndicator size="large" color="#2C5F8D" style={{ marginTop: 20 }} />
          ) : (
            categoriesQuery.data?.map((category) => (
              <View key={category.id} style={styles.categoryCard}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryRoute}>{category.route}</Text>
                </View>
                <View style={styles.categoryActions}>
                  <TouchableOpacity
                    onPress={() => openEditModal(category)}
                    style={styles.actionButton}
                  >
                    <Edit size={18} color="#3498DB" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(category.id)}
                    style={[styles.actionButton, styles.deleteButton]}
                  >
                    <Trash2 size={18} color="#E74C3C" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Documents</Text>
            <TouchableOpacity style={styles.addButton}>
              <Upload size={20} color="#fff" />
              <Text style={styles.addButtonText}>Upload</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.placeholderCard}>
            <FileText size={32} color="#999" />
            <Text style={styles.placeholderText}>
              Document management coming soon
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <Text style={styles.label}>ID *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., my-category"
                value={formData.id}
                onChangeText={(text) => setFormData({ ...formData, id: text })}
                editable={!editingCategory}
              />

              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Category Title"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
              />

              <Text style={styles.label}>Icon</Text>
              <TextInput
                style={styles.input}
                placeholder="Icon name or URL"
                value={formData.icon}
                onChangeText={(text) => setFormData({ ...formData, icon: text })}
              />

              <Text style={styles.label}>Route *</Text>
              <TextInput
                style={styles.input}
                placeholder="/my-route"
                value={formData.route}
                onChangeText={(text) => setFormData({ ...formData, route: text })}
              />

              <Text style={styles.label}>Color 1</Text>
              <TextInput
                style={styles.input}
                placeholder="#3498DB"
                value={formData.colors[0]}
                onChangeText={(text) =>
                  setFormData({ ...formData, colors: [text, formData.colors[1]] })
                }
              />

              <Text style={styles.label}>Color 2</Text>
              <TextInput
                style={styles.input}
                placeholder="#2980B9"
                value={formData.colors[1]}
                onChangeText={(text) =>
                  setFormData({ ...formData, colors: [formData.colors[0], text] })
                }
              />

              <TouchableOpacity
                onPress={handleSave}
                style={styles.saveButton}
                disabled={
                  addCategoryMutation.isPending || updateCategoryMutation.isPending
                }
              >
                {addCategoryMutation.isPending || updateCategoryMutation.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Save size={20} color="#fff" />
                    <Text style={styles.saveButtonText}>Save</Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 12,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27AE60',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  categoryCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  categoryRoute: {
    fontSize: 14,
    color: '#666',
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  deleteButton: {},
  placeholderCard: {
    backgroundColor: '#fff',
    padding: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  modalForm: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C5F8D',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 20,
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
