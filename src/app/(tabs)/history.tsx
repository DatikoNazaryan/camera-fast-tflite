import {
  useCallback,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Animated,
  Alert,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import Input from '@/src/components/form/Input';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Swipeable } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets, } from 'react-native-safe-area-context';
import { getRecognitionsRequest, deleteRecognitionRequest, } from '@/src/store/actions/recognitionAction';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { API_URL } from '@src/Api';

export default function HistoryScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const safeAreaInsets = useSafeAreaInsets();
  const history = useAppSelector((state) => state.recognitionReduce.recognitions);
  const requestMessage = useAppSelector((state) => state.recognitionReduce.requestMessage);
  const historyListData = useAppSelector(state => state.recognitionReduce.recognitionsListData);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const rowRefs = useRef<{ [key: string]: Swipeable | null; }>({});
  const [search, setSearch] = useState('');

  const getRecognitions = useCallback((page = 1) => {
    dispatch(getRecognitionsRequest({
      page,
      search: search.trim() || undefined,
      limit: 10,
    }));
  }, [search]);

  useFocusEffect(
    useCallback(() => {
      getRecognitions();
      setSelectedIds([]);
    }, []),
  );

  const isLoading = requestMessage === 'request';
  const isAllSelected =
    history.length > 0 &&
    selectedIds.length === history.length;

  const toggleSelection = useCallback(
    (id: string) => {
      setSelectedIds((current) => {
        if (current.includes(id)) {
          return current.filter(
            (itemId) => itemId !== id,
          );
        }

        return [...current, id];
      });
    },
    [],
  );

  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(
      history.map((item) => item.id),
    );
  }, [history, isAllSelected]);

  const deleteItem = useCallback(
    async (id: string) => {
      rowRefs.current[id]?.close();

      try {
        await dispatch(
          deleteRecognitionRequest(id),
        ).unwrap();

        setSelectedIds((current) =>
          current.filter(
            (itemId) => itemId !== id,
          ),
        );
      } catch (error) {
        console.error(
          'Failed to delete recognition:',
          error,
        );
      }
    },
    [dispatch],
  );

  const deleteSelected = useCallback(() => {
    if (selectedIds.length === 0) {
      return;
    }

    Alert.alert(
      t('DeleteHistory'),
      t('DeleteSelectedHistoryConfirm', {
        count: selectedIds.length,
      }),
      [
        {
          text: t('Cancel'),
          style: 'cancel',
        },
        {
          text: t('Delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await Promise.all(
                selectedIds.map((id) =>
                  dispatch(
                    deleteRecognitionRequest(id),
                  ).unwrap(),
                ),
              );

              setSelectedIds([]);
            } catch (error) {
              console.error(
                'Failed to delete selected recognitions:',
                error,
              );
            }
          },
        },
      ],
    );
  }, [dispatch, selectedIds, t]);

  const getImageUrl = useCallback(
    (imageUrl: string | null) => {
      if (!imageUrl) {
        return null;
      }

      return `${API_URL}${imageUrl}`;
    },
    [],
  );

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    id: string,
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
        <Animated.View style={{ transform: [{ scale }], }}>
          <Ionicons
            name="trash-outline"
            size={24}
            color="#fff"
          />
        </Animated.View>
      </TouchableOpacity>
    );
  };


  const renderItem = ({ item, }: { item: (typeof history)[number]; }) => {
    const selected = selectedIds.includes(
      item.id,
    );

    const imageUrl = getImageUrl(
      item.imageUrl,
    );

    return (
      <Swipeable
        ref={(ref) => {
          rowRefs.current[item.id] = ref;
        }}
        renderRightActions={(
          progress,
          dragX,
        ) =>
          renderRightActions(
            progress,
            dragX,
            item.id,
          )
        }
        overshootRight={false}
      >
        <View
          style={[
            styles.card,
            selected && styles.selectedCard,
          ]}
        >
          <TouchableOpacity
            style={styles.checkboxButton}
            onPress={() =>
              toggleSelection(item.id)
            }
          >
            <View
              style={[
                styles.checkbox,
                selected &&
                styles.checkboxSelected,
              ]}
            >
              {selected && (
                <Ionicons
                  name="checkmark"
                  size={16}
                  color="#fff"
                />
              )}
            </View>
          </TouchableOpacity>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl, }}
              style={styles.imageThumbnail}
            />
          ) : (
            <View style={styles.iconContainer}>
              <Ionicons
                name="cube-outline"
                size={26}
                color="#38bdf8"
              />
            </View>
          )}

          <View style={styles.content}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.date}>
              {moment(item.createdAt).format('D MMMM, HH:mm')}
            </Text>
          </View>

          <View style={styles.rightContainer}>
            <Text style={styles.confidence}>
              {Math.round(item.confidence * 100)}%
            </Text>
          </View>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155',]}
        style={[
          styles.gradient,
          { paddingTop: safeAreaInsets.top + 20, },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {t('History')}
          </Text>
          <TouchableOpacity
            style={styles.deleteSelectedButton}
            onPress={deleteSelected}
          >
            <Ionicons
              name="trash-outline"
              size={19}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <Input
            value={search}
            onChangeText={setSearch}
            placeholder={t('SearchHistory')}
            iconLeft="search-outline"
            iconRight={search ? 'close-circle' : undefined}
            onIconRightPress={() => setSearch('')}
            iconSize={21}
            wrapperStyle={styles.searchInputWrapper}
            style={styles.searchInput}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {history.length > 0 && (
          <View style={styles.selectionToolbar}>
            <TouchableOpacity
              style={styles.selectAllButton}
              onPress={toggleSelectAll}
            >
              <Ionicons
                name={
                  isAllSelected
                    ? 'checkbox'
                    : 'square-outline'
                }
                size={22}
                color="#38bdf8"
              />

              <Text
                style={styles.selectAllText}
              >
                {isAllSelected
                  ? t('DeselectAll')
                  : t('SelectAll')}
              </Text>
            </TouchableOpacity>
            {selectedIds.length > 0 && (
              <Text style={styles.selectedText}>
                {t('Selected')}{' '}
                {selectedIds.length}
              </Text>
            )}
          </View>
        )}
        {history.length === 0 &&
        !isLoading ? (
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
              {t(
                'RecognizedObjectsWillAppearHere',
              )}
            </Text>
          </View>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            refreshControl={(
              <RefreshControl
                refreshing={requestMessage === 'request' && history.length === 0}
                onRefresh={getRecognitions}
                progressViewOffset={safeAreaInsets.top}
              />
            )}
            renderItem={renderItem}
            contentContainerStyle={
              styles.list
            }
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.3}
            onEndReached={() => {
              if (historyListData.page < historyListData.totalPages && requestMessage !== 'request') {
                getRecognitions(historyListData.page + 1);
              }
            }}
            ListFooterComponent={(
              historyListData.page || 0) < (historyListData?.totalPages || 0) ? (
              <ActivityIndicator />
            ) : null}
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

  gradient: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  searchContainer: {
    paddingHorizontal: 18,
    marginBottom: 4,
  },

  searchInputWrapper: {
    marginVertical: 4,
  },

  searchInput: {
    height: 50,
    borderRadius: 16,
    paddingLeft: 48,
    paddingRight: 44,
    fontSize: 15,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },

  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },

  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  selectAllText: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '600',
  },

  selectionToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  selectedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  deleteSelectedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },

  deleteSelectedText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(15, 23, 42, 0.9)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor:
      'rgba(56, 189, 248, 0.15)',
    padding: 14,
    marginBottom: 12,
  },

  selectedCard: {
    borderColor:
      'rgba(56, 189, 248, 0.6)',
  },

  checkboxButton: {
    marginRight: 10,
    padding: 3,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#64748b',
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxSelected: {
    backgroundColor: '#38bdf8',
    borderColor: '#38bdf8',
  },

  imageThumbnail: {
    width: 52,
    height: 52,
    borderRadius: 16,
    marginRight: 14,
    borderWidth: 1,
    borderColor:
      'rgba(56, 189, 248, 0.3)',
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor:
      'rgba(56, 189, 248, 0.1)',
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

  deleteAction: {
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '83%',
    borderRadius: 18,
    marginBottom: 12,
    marginLeft: 8,
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
