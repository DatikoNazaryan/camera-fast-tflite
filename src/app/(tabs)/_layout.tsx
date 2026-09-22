import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions, Platform, useWindowDimensions, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from "react-i18next";

const TAB_BAR_HEIGHT = 64;

const tabBarStyle: ViewStyle = {
  position: 'absolute',
  bottom: 16,
  left: 16,
  right: 16,
  elevation: 8,
  backgroundColor: 'rgba(15, 23, 42, 0.9)',
  borderRadius: 24,
  borderTopWidth: 0,
  borderWidth: 1,
  borderColor: 'rgba(56, 189, 248, 0.2)',
  height: TAB_BAR_HEIGHT,
  paddingBottom: Platform.OS === 'ios' ? 4 : 8,
  paddingTop: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.3,
  shadowRadius: 12,
};

const { width } = Dimensions.get('window');

export default function TabLayout() {
  const { t } = useTranslation();
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...tabBarStyle,
          bottom: Math.max(safeAreaInsets.bottom + 16, 16),
          marginHorizontal: 8,
        },
        tabBarActiveTintColor: '#38bdf8',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 4,
        },
        tabBarItemStyle: {
          flex: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("Home"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size - 2} color={color} />
          ),
          tabBarLabel: t("Home"),
        }}
      />
      <Tabs.Screen
        name="cars"
        options={{
          title: t('Cars'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car-sport" size={size - 2} color={color} />
          ),
          tabBarLabel: t('Cars'),
        }}
      />
      <Tabs.Screen
        name="calories"
        options={{
          title: t('Calories'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="nutrition" size={size - 2} color={color} />
          ),
          tabBarLabel: t('Calories'),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('Settings'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size - 2} color={color} />
          ),
          tabBarLabel: t('SettingsShort'),
        }}
      />
    </Tabs>
  );
}