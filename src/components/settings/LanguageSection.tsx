import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import CheckBox from '@/src/components/form/CheckBox';

type Props = {
  language: string;
  onChangeLanguage: (language: string) => void;
};

export default function LanguageSection(props: Props) {
  const { t } = useTranslation();
  const { language, onChangeLanguage, } = props

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {t('settings.selectLanguage')}
      </Text>

      <CheckBox
        style={styles.langButton}
        value={language === 'hy'}
        onPress={() =>
          onChangeLanguage('hy')
        }
      >
        <View style={styles.rowContent}>
          <Ionicons
            name="globe-outline"
            size={20}
            color="#38bdf8"
          />

          <Text style={styles.langText}>
            {t('settings.armenian')}
          </Text>
        </View>
      </CheckBox>

      <CheckBox
        style={styles.langButton}
        value={language === 'ru'}
        onPress={() =>
          onChangeLanguage('ru')
        }
      >
        <View style={styles.rowContent}>
          <Ionicons
            name="globe-outline"
            size={20}
            color="#38bdf8"
          />

          <Text style={styles.langText}>
            {t('settings.russian')}
          </Text>
        </View>
      </CheckBox>

      <CheckBox
        style={styles.langButton}
        value={language === 'en'}
        onPress={() =>
          onChangeLanguage('en')
        }
      >
        <View style={styles.rowContent}>
          <Ionicons
            name="globe-outline"
            size={20}
            color="#38bdf8"
          />

          <Text style={styles.langText}>
            {t('settings.english')}
          </Text>
        </View>
      </CheckBox>
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

  langButton: {
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

  langText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
});
