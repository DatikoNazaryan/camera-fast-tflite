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
  onChangeName: () => void;
  onChangePassword: () => void;
};

export default function AccountSection(props: Props) {
  const { t } = useTranslation();
  const { onChangeName, onChangePassword, } = props

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {t('settings.account')}
      </Text>

      <Pressable
        style={styles.actionButton}
        onPress={onChangeName}
      >
        <View style={styles.rowContent}>
          <Ionicons
            name="person-outline"
            size={21}
            color="#38bdf8"
          />

          <Text style={styles.actionText}>
            {t('settings.changeName')}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#64748b"
        />
      </Pressable>

      <Pressable
        style={styles.actionButton}
        onPress={onChangePassword}
      >
        <View style={styles.rowContent}>
          <Ionicons
            name="lock-closed-outline"
            size={21}
            color="#38bdf8"
          />

          <Text style={styles.actionText}>
            {t('settings.changePassword')}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#64748b"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor:
      'rgba(56, 189, 248, 0.15)',
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 16,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor:
      'rgba(255, 255, 255, 0.05)',
  },

  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  actionText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
});
