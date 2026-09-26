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
import { registrationRequest } from '@src/store/actions/authenticationAction';
import Toast from 'react-native-simple-toast';
import Input from '@/src/components/form/Input';
import Button from '@/src/components/form/Button';
import { useAppDispatch } from "@src/store";


export default function RegisterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { payload = {} } = await dispatch(
      registrationRequest({
        name,
        email,
        password,
      })
    );

    if (payload.errors?.email) {
      setError(payload.errors?.email);
    } else if (!payload.success) {
      Toast.show(payload.message || '', 5);
    }

    setIsLoading(false);
  }, [email, name, password]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
            <Ionicons name="arrow-back" size={24} color="#fff"/>
          </Pressable>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>
            {t('createAccount', {
              defaultValue: 'Create Account',
            })}
          </Text>

          <Text style={styles.subtitle}>
            {t('signUpToGetStarted', {
              defaultValue: 'Sign up to start recognizing objects',
            })}
          </Text>

          <Input
            error={error}
            label={t('namePlaceholder', {
              defaultValue: 'Full Name',
            })}
            placeholder="John Doe"
            iconLeft="person-outline"
            value={name}
            onChangeText={setName}
            wrapperStyle={styles.inputSpacing}
          />

          <Input
            error={error}
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
            error={error}
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
              setIsPasswordVisible(!isPasswordVisible)
            }
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
            wrapperStyle={styles.inputSpacing}
          />

          <Button
            style={styles.buttonSpacing}
            onPress={handleRegister}
            disabled={isLoading}
            loading={isLoading}
          >
            {t('register', { defaultValue: 'Sign Up' })}
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
    paddingHorizontal: 24,
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
    marginLeft: 10,
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 8,
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
