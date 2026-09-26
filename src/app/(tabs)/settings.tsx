import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Api from '@src/Api';
import { changeLanguageAndReload } from '@/src/locales/i18n';
import {
  useAppDispatch,
  useAppSelector,
} from '@src/store';
import { logOut, updateUserRequest } from '@/src/store/actions/authenticationAction';
import SettingsModal from '@/src/components/modals/SettingsModal';
import AccountSection from '@/src/components/settings/AccountSection';
import LanguageSection from '@/src/components/settings/LanguageSection';
import DangerSection from '@/src/components/settings/DangerSection';
import Toast from "react-native-simple-toast";

export type ModalType =
  | 'name'
  | 'password'
  | 'logout'
  | 'delete'
  | null;

export default function SettingsScreen() {
  const { t } = useTranslation();
  const safeAreaInsets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.AuthenticationReduce.user,);
  const [language, setLanguage] = useState(i18n.language,);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [name, setName] = useState(user?.name ?? '',);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChangeLanguage = useCallback(
    (lng: string) => {
      setLanguage(lng);
      changeLanguageAndReload(lng);
    },
    [],
  );

  const handleSaveName = useCallback(async () => {
    const trimmedName = name.trim();

    if (!trimmedName || !user?.id) {
      return;
    }

    try {
      setIsUpdating(true);

      await dispatch(
        updateUserRequest({
          userId: user.id,
          field: 'name',
          value: trimmedName,
        }),
      );

    } catch (error) {
      Toast.show(t('settings.failedToUpdateName'), 5,);
    } finally {
      setIsUpdating(false);
      setModalType(null);
    }
  }, [name]);

  const handleChangePassword = async () => {
    if (!newPassword || !user?.id) return;
    if (newPassword.length < 6) return;
    if (newPassword !== confirmPassword) return;

    try {
      setIsUpdating(true);

      await dispatch(
        updateUserRequest({
          userId: user.id,
          field: 'password',
          value: confirmPassword,
        }),
      );

    } catch (error) {
      Toast.show(t('settings.failedToUpdatePassword'), 5,);
    } finally {
      setIsUpdating(false);
      setNewPassword('');
      setConfirmPassword('');
      setModalType(null);
    }
  };

  const confirmLogout = useCallback(() => {
    dispatch(logOut());
    setModalType(null);
  }, []);

  const confirmDeleteAccount = useCallback(async () => {
    if (!user?.id) return;

    await Api.deleteUser(user.id);
    dispatch(logOut());
    setModalType(null);
  },[]);

  const closeModal = useCallback(() => {
    setModalType(null);
    setNewPassword('');
    setConfirmPassword('');
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          '#0f172a',
          '#1e293b',
          '#334155',
        ]}
        style={styles.gradient}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop:
                safeAreaInsets.top + 20,
              paddingBottom:
                safeAreaInsets.bottom + 100,
            },
          ]}
        >
          <Text style={styles.title}>
            {t('settings.title')}
          </Text>
          <View style={styles.userSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name
                    ?.charAt(0)
                    ?.toUpperCase() ||
                  t('settings.user')
                    .charAt(0)
                    .toUpperCase()}
              </Text>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {user?.name ||
                  t('settings.user')}
              </Text>

              <Text style={styles.userEmail}>
                {user?.email || ''}
              </Text>
            </View>
          </View>
          <AccountSection
            onChangeName={() => setModalType('name')}
            onChangePassword={() => setModalType('password')}
          />
          <LanguageSection
            language={language}
            onChangeLanguage={handleChangeLanguage}
          />
          <DangerSection
            onLogout={() => setModalType('logout')}
            onDeleteAccount={() => setModalType('delete')}
          />
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t('graduationWork')}
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
      <SettingsModal
        modalType={modalType}
        name={name}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        onNameChange={setName}
        onNewPasswordChange={setNewPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onClose={closeModal}
        onSaveName={handleSaveName}
        onChangePassword={handleChangePassword}
        onLogout={confirmLogout}
        onDeleteAccount={confirmDeleteAccount}
        loading={isUpdating}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  gradient: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 20,
  },

  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.15)',
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#38bdf8',
    fontSize: 22,
    fontWeight: '700',
  },

  userInfo: {
    marginLeft: 14,
    flex: 1,
  },

  userName: {
    color: '#f8fafc',
    fontSize: 17,
    fontWeight: '600',
  },

  userEmail: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 4,
  },

  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },

  footerText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '500',
  },
});
