import { Text, StyleSheet, Pressable, View } from 'react-native';
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import logoUrl from '@/assets/images/logo.png'

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.gradient}
      >
        <View style={styles.contentContainer}>
          <View style={styles.iconBadge}>
            <Image
              source={logoUrl}
              style={styles.logo}
              contentFit="contain"
            />
          </View>

          <Text style={styles.title}>{t("homeTitle")}</Text>
          <Text style={styles.subtitle}>{t("homeSubtitle")}</Text>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
            ]}
            onPress={() => {
              router.push("/camera");
            }}
          >
            <Ionicons name="sparkles" size={22} color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.buttonText}>{t("startCamera")}</Text>
          </Pressable>
        </View>

        <View style={[styles.footer, { bottom: safeAreaInsets.bottom + 90}]}>
          <Text style={styles.footerText}>{t("graduationWork")}</Text>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  contentContainer: {
    alignItems: 'center',
    maxWidth: 400,
  },
  iconBadge: {
    marginBottom: 20,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 40,
    padding: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  logo: {
    width: 80,
    height: 80,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#0284c7',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
  },
  footerText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '500',
  },
});