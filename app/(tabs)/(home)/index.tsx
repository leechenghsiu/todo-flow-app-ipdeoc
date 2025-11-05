
import React, { useState } from 'react';
import { 
  Stack 
} from 'expo-router';
import { 
  ScrollView, 
  Pressable, 
  StyleSheet, 
  View, 
  Text, 
  Platform 
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import TodoItem, { Todo } from '@/components/TodoItem';
import AddTodoModal from '@/components/AddTodoModal';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function HomeScreen() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      title: 'Welcome to your Todo App!',
      description: 'Tap the + button to add your first todo',
      completed: false,
      createdAt: new Date(),
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const handleAddTodo = (title: string, description?: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
      createdAt: new Date(),
    };
    setTodos([newTodo, ...todos]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter(t => !t.completed).length;
  const completedTodosCount = todos.filter(t => t.completed).length;

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => setModalVisible(true)}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="plus" color={colors.primary} size={24} />
    </Pressable>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'My Todos',
            headerRight: renderHeaderRight,
          }}
        />
      )}
      
      <View style={styles.container}>
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{activeTodosCount}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completedTodosCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{todos.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <Pressable
            style={[
              styles.filterButton,
              filter === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setFilter('all')}
          >
            <Text style={[
              styles.filterText,
              filter === 'all' && styles.filterTextActive
            ]}>
              All
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterButton,
              filter === 'active' && styles.filterButtonActive
            ]}
            onPress={() => setFilter('active')}
          >
            <Text style={[
              styles.filterText,
              filter === 'active' && styles.filterTextActive
            ]}>
              Active
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterButton,
              filter === 'completed' && styles.filterButtonActive
            ]}
            onPress={() => setFilter('completed')}
          >
            <Text style={[
              styles.filterText,
              filter === 'completed' && styles.filterTextActive
            ]}>
              Completed
            </Text>
          </Pressable>
        </View>

        {/* Todo List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.listContainer,
            Platform.OS !== 'ios' && styles.listContainerWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {filteredTodos.length === 0 ? (
            <Animated.View 
              entering={FadeIn}
              exiting={FadeOut}
              style={styles.emptyState}
            >
              <IconSymbol 
                name="checkmark.circle" 
                size={64} 
                color={colors.textSecondary}
              />
              <Text style={styles.emptyStateTitle}>
                {filter === 'active' && 'No active todos'}
                {filter === 'completed' && 'No completed todos'}
                {filter === 'all' && 'No todos yet'}
              </Text>
              <Text style={styles.emptyStateText}>
                {filter === 'all' 
                  ? 'Tap the + button to add your first todo'
                  : 'Try switching to a different filter'
                }
              </Text>
            </Animated.View>
          ) : (
            filteredTodos.map((todo) => (
              <Animated.View
                key={todo.id}
                entering={FadeIn}
                exiting={FadeOut}
              >
                <TodoItem
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                />
              </Animated.View>
            ))
          )}
        </ScrollView>

        {/* Floating Add Button for Android/Web */}
        {Platform.OS !== 'ios' && (
          <Pressable
            style={styles.fab}
            onPress={() => setModalVisible(true)}
          >
            <IconSymbol name="plus" size={28} color={colors.card} />
          </Pressable>
        )}
      </View>

      <AddTodoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddTodo}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.textSecondary + '20',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filterTextActive: {
    color: colors.card,
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  listContainerWithTabBar: {
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  headerButtonContainer: {
    padding: 6,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: Platform.OS === 'android' ? 90 : 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(98, 0, 238, 0.4)',
    elevation: 8,
  },
});
