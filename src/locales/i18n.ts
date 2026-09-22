import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import secureStorage from '@/src/utils/secureStorage';
import * as Updates from 'expo-updates';

const deviceLanguage =
  secureStorage.getString('language') ||
  getLocales()[0]?.languageCode ||
  'hy';

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      lng: ['en', 'hy', 'ru'].includes(deviceLanguage)
        ? deviceLanguage
        : 'hy',

      fallbackLng: 'hy',

      resources: {
        en: {
          translation: require('./en.json'),
        },
        hy: {
          translation: require('./hy.json'),
        },
        ru: {
          translation: require('./ru.json'),
        },
      },

      interpolation: {
        escapeValue: false,
      },
    })
    .catch(console.error);

  i18n.on('languageChanged', (language: string) => {
    secureStorage.setString('language', language);
  });
}

export function changeLanguageAndReload(language: string) {
  secureStorage.setString('language', language);

  Updates.reloadAsync({
    reloadScreenOptions: {
      fade: true,
      spinner: {
        enabled: true,
        color: '#443A95',
        size: 'medium',
      },
    },
  }).catch(console.error);
}

export const { t } = i18n;

export default i18n;
