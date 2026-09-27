import { useCallback, useState, useRef } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import secureStorage from '@/src/utils/secureStorage';
import { Swipeable } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from "react-native-safe-area-context";

type RecognitionItem = {
  id: string;
  name: string;
  confidence: number;
  imageUri?: string;
  createdAt: string;
};

const RECOGNITION_HISTORY_KEY = 'recognition.history';

export default function HistoryScreen() {
  const { t } = useTranslation();
  const [history, setHistory] = useState<RecognitionItem[]>([]);
  const safeAreaInsets = useSafeAreaInsets();
  const rowRefs = useRef<{ [key: string]: Swipeable | null }>({});

  const loadHistory = async () => {
    const data =
      (await secureStorage.getArrayAsync<RecognitionItem>(
        RECOGNITION_HISTORY_KEY,
      )) ?? [];

    setHistory(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, []),
  );

  const clearHistory = async () => {
    await secureStorage.setArrayAsync(RECOGNITION_HISTORY_KEY, []);
    setHistory([]);
  };

  const deleteItem = async (id: string) => {
    if (rowRefs.current[id]) {
      rowRefs.current[id]?.close();
    }
    const updatedHistory = history.filter((item) => item.id !== id);
    await secureStorage.setArrayAsync(RECOGNITION_HISTORY_KEY, updatedHistory);
    setHistory(updatedHistory);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    id: string
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => deleteItem(id)}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons name="trash-outline" size={24} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: RecognitionItem }) => (
    <Swipeable
      ref={(ref) => {
        rowRefs.current[item.id] = ref;
      }}
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item.id)
      }
      overshootRight={false}
    >
      <View style={styles.card}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.imageThumbnail} />
        ) : (
          <View style={styles.iconContainer}>
            <Ionicons name="cube-outline" size={26} color="#38bdf8" />
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>

          <Text style={styles.date}>
            {formatDate(item.createdAt)}
          </Text>
        </View>

        <View style={styles.rightContainer}>
          <Text style={styles.confidence}>
            {Math.min(100, Math.round(item.confidence))} %
          </Text>
        </View>
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={[styles.gradient, { paddingTop: safeAreaInsets.top + 20 }]}
      >
      <View style={styles.header}>
        <Text style={styles.title}>{t('History')}</Text>

        {history.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearHistory}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color="#f87171"
            />
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="time-outline"
            size={64}
            color="#475569"
          />

          <Text style={styles.emptyTitle}>
            {t('NoHistory')}
          </Text>

          <Text style={styles.emptyText}>
            {t('RecognizedObjectsWillAppearHere')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  gradient: {
    flex: 1,
  },

  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },

  clearButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.15)',
    padding: 14,
    marginBottom: 12,
  },

  // Աջից քաշելիս բացվող կոճակի ոճը
  deleteAction: {
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '83%', // Համապատասխանում է քարտի բարձրությանը (հանած margin-ը)
    borderRadius: 18,
    marginBottom: 12,
    marginLeft: 8,
  },

  imageThumbnail: {
    width: 52,
    height: 52,
    borderRadius: 16,
    marginRight: 14,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  content: {
    flex: 1,
  },

  name: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 5,
  },

  date: {
    color: '#94a3b8',
    fontSize: 12,
  },

  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  confidence: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: '600',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },

  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 18,
    marginBottom: 8,
  },

  emptyText: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
  },
});
