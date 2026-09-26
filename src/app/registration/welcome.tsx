import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import logoUrl from '@/assets/images/logo.png';
import { Image } from 'expo-image';
import Button from '@/src/components/form/Button';

export default function WelcomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.gradient}
      >
        <View style={[styles.content, { paddingTop: safeAreaInsets.top + 40, paddingBottom: safeAreaInsets.bottom + 40 }]}>
          <View style={styles.iconBadge}>
            <Image
              source={logoUrl}
              style={styles.logo}
              contentFit="contain"
            />
          </View>
          <Text style={styles.title}>{t('welcomeTitle', { defaultValue: 'Smart Recognition' })}</Text>
          <Text style={styles.subtitle}>
            {t('welcomeSubtitle', { defaultValue: 'Scan and recognize objects instantly using AI and your camera.' })}
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              onPress={() => router.push('/registration/login')}
            >
              {t('login', { defaultValue: 'Log In' })}
            </Button>
            <Button
              style={styles.secondaryButton}
              textStyle={styles.secondaryButtonText}
              onPress={() => router.push('/registration/register')}
            >
              {t('register', { defaultValue: 'Create Account' })}
            </Button>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 24
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 80,
    height: 80,
  },
  iconBadge: {
    marginBottom: 24,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 30,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: 12
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
    paddingHorizontal: 10,
    flexShrink: 1
  },
  buttonContainer: {
    width: '100%',
    gap: 16
  },
  secondaryButton: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    shadowColor: 'transparent',
    elevation: 0,
  },
  secondaryButtonText: {
    color: '#38bdf8',
  },
});
