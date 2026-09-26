import { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import Input from '@/src/components/form/Input';
import Button from '@/src/components/form/Button';
import Toast from 'react-native-simple-toast';
import { loginRequest } from '@src/store/actions/authenticationAction';
import { useAppDispatch } from '@src/store';

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = useCallback(async () => {
    setIsLoading(true);

    const { payload = {} } = await dispatch(
      loginRequest({
        email,
        password
      })
    );

    if (!payload.success) {
      Toast.show(payload.message || '', 5);
    }

    setIsLoading(false);
  }, [email, password, dispatch]);

  return (
    <KeyboardAvoidingView
      behavior={
        Platform.OS === 'ios' ? 'padding' : 'height'
      }
      style={styles.container}
    >
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#fff"
            />
          </Pressable>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>
            {t('welcomeBack', {
              defaultValue: 'Welcome Back',
            })}
          </Text>
          <Text style={styles.subtitle}>
            {t('signInToContinue', {
              defaultValue:
                'Sign in to access your scanned history',
            })}
          </Text>
          <Input
            label={t('emailPlaceholder', {
              defaultValue: 'Email',
            })}
            placeholder="example@gmail.com"
            iconLeft="mail-outline"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            inputType="email-address"
            wrapperStyle={styles.inputSpacing}
          />

          <Input
            label={t('passwordPlaceholder', {
              defaultValue: 'Password',
            })}
            placeholder="••••••••"
            iconLeft="lock-closed-outline"
            iconRight={
              isPasswordVisible
                ? 'eye-outline'
                : 'eye-off-outline'
            }
            onIconRightPress={() =>
              setIsPasswordVisible(
                !isPasswordVisible,
              )
            }
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
            wrapperStyle={styles.inputSpacing}
          />

          <Button
            style={styles.buttonSpacing}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading
              ? 'Signing in...'
              : t('login', {
                defaultValue: 'Sign In',
              })}
          </Button>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 8,
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#94a3b8',
    marginBottom: 32,
    lineHeight: 22,
    marginLeft: 10,
    flexShrink: 1,
  },
  inputSpacing: {
    marginBottom: 16,
  },
  buttonSpacing: {
    marginTop: 16,
  },
});
