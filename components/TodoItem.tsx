
import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors } from '@/styles/commonStyles';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onToggle(todo.id);
  };

  const handleDelete = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onDelete(todo.id);
  };

  return (
    <AnimatedPressable
      style={[styles.container, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handleToggle}
    >
      <View style={styles.content}>
        <Pressable 
          style={[
            styles.checkbox,
            todo.completed && styles.checkboxCompleted
          ]}
          onPress={handleToggle}
        >
          {todo.completed && (
            <IconSymbol 
              name="checkmark" 
              size={18} 
              color={colors.card}
            />
          )}
        </Pressable>

        <View style={styles.textContainer}>
          <Text 
            style={[
              styles.title,
              todo.completed && styles.titleCompleted
            ]}
            numberOfLines={2}
          >
            {todo.title}
          </Text>
          {todo.description && (
            <Text 
              style={[
                styles.description,
                todo.completed && styles.descriptionCompleted
              ]}
              numberOfLines={2}
            >
              {todo.description}
            </Text>
          )}
        </View>

        <Pressable 
          style={styles.deleteButton}
          onPress={handleDelete}
          hitSlop={8}
        >
          <IconSymbol 
            name="trash" 
            size={20} 
            color={colors.highlight}
          />
        </Pressable>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  descriptionCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  deleteButton: {
    padding: 4,
  },
});
