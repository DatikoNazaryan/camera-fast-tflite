import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { changeLanguageAndReload } from '@/src/locales/i18n';
import i18n from 'i18next';
import CheckBox from '@/src/components/form/CheckBox';
import { useTranslation } from "react-i18next";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const handleChangeLanguage = useCallback((lng: string) => {
    setLanguage(lng);
    changeLanguageAndReload(lng);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("Settings")}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("Select Language")}</Text>
        <CheckBox
          style={styles.langButton}
          value={language === 'hy'}
          onPress={() => handleChangeLanguage('hy')}
        >
          <View style={styles.rowContent}>
            <Ionicons name="globe-outline" size={20} color="#38bdf8" />
            <Text style={styles.langText}>Հայերեն</Text>
          </View>
        </CheckBox>

        <CheckBox
          style={styles.langButton}
          value={language === 'ru'}
          onPress={() => handleChangeLanguage('ru')}
        >
          <View style={styles.rowContent}>
            <Ionicons name="globe-outline" size={20} color="#38bdf8" />
            <Text style={styles.langText}>Русский</Text>
          </View>
        </CheckBox>

        <CheckBox
          style={styles.langButton}
          value={language === 'en'}
          onPress={() => handleChangeLanguage('en')}
        >
          <View style={styles.rowContent}>
            <Ionicons name="globe-outline" size={20} color="#38bdf8" />
            <Text style={styles.langText}>English</Text>
          </View>
        </CheckBox>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Ավարտական Աշխատանք • 2026</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 30,
  },
  section: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.15)',
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
    borderColor: 'rgba(255, 255, 255, 0.05)',
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
  footer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  footerText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '500',
  },
});