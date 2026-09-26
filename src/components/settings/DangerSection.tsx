import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

type Props = {
  onLogout: () => void;
  onDeleteAccount: () => void;
};

export default function DangerSection(props: Props) {
  const { t } = useTranslation();
  const { onLogout, onDeleteAccount, } = props;

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.logoutButton}
        onPress={onLogout}
      >
        <Ionicons
          name="log-out-outline"
          size={21}
          color="#f8fafc"
        />

        <Text style={styles.logoutText}>
          {t('settings.logout')}
        </Text>
      </Pressable>

      <Pressable
        style={styles.deleteButton}
        onPress={onDeleteAccount}
      >
        <Ionicons
          name="trash-outline"
          size={21}
          color="#ef4444"
        />

        <Text style={styles.deleteText}>
          {t('settings.deleteAccount')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginTop: 2,
  },

  logoutButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor:
      'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  logoutText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },

  deleteButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor:
      'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor:
      'rgba(239, 68, 68, 0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  deleteText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
});
