import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-simple-toast';
import { useTranslation } from 'react-i18next';
import { ModalType } from '@/src/app/(tabs)/settings';
import Button from '@/src/components/form/Button'

type SettingsModalProps = {
  modalType: ModalType;
  name: string;
  newPassword: string;
  confirmPassword: string;
  onNameChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onClose: () => void;
  onSaveName: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  loading: boolean;
};

export default function SettingsModal(props: SettingsModalProps) {
  const { t } = useTranslation();
  const {
    modalType,
    name,
    newPassword,
    confirmPassword,
    onNameChange,
    onNewPasswordChange,
    onConfirmPasswordChange,
    onClose,
    onSaveName,
    onChangePassword,
    onLogout,
    onDeleteAccount,
    loading
  } = props;
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword,] = useState(false);

  const getModalTitle = () => {
    switch (modalType) {
      case 'name':
        return t('settings.changeName');

      case 'password':
        return t('settings.changePassword');

      default:
        return '';
    }
  };

  const handleClose = () => {
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const handleSaveName = () => {
    if (!name.trim()) {
      Toast.show(t('settings.errors.nameRequired'), 5,);
      return;
    }

    Toast.show(t('settings.success.nameChanged'), 5,);

    onSaveName();
  };

  const handleChangePassword = () => {
    if (!newPassword) {
      Toast.show(t('settings.errors.passwordRequired'), 5,);
      return;
    }

    if (newPassword.length < 6) {
      Toast.show(
        t(
          'settings.errors.passwordMinLength',
        ),
        5,
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show(t('settings.errors.passwordMismatch',), 5,);
      return;
    }

    Toast.show(t('settings.success.passwordChanged'), 5,);

    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onChangePassword();
  };

  return (
    <Modal
      visible={modalType !== null}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={handleClose}
      >
        <Pressable
          style={styles.modalContainer}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {getModalTitle()}
            </Text>

            <Pressable
              onPress={handleClose}
              hitSlop={10}
            >
              <Ionicons
                name="close"
                size={25}
                color="#94a3b8"
              />
            </Pressable>
          </View>
          {modalType === 'name' && (
            <>
              <TextInput
                style={styles.textInput}
                placeholder={t('settings.enterNewName',)}
                placeholderTextColor="#64748b"
                value={name}
                onChangeText={onNameChange}
                autoCapitalize="words"
              />
              <Button
                onPress={handleSaveName}
                loading={loading}
              >
                {t('common.save')}
              </Button>
              {/*<Pressable*/}
              {/*  style={styles.saveButton}*/}
              {/*  onPress={handleSaveName}*/}
              {/*>*/}
              {/*  <Text style={styles.saveButtonText}>*/}
              {/*    */}
              {/*  </Text>*/}
              {/*</Pressable>*/}
            </>
          )}
          {modalType === 'password' && (
            <>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={t('settings.newPassword',)}
                  placeholderTextColor="#64748b"
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={onNewPasswordChange}
                  autoCapitalize="none"
                />

                <Pressable
                  style={styles.eyeButton}
                  onPress={() => setShowNewPassword((value) => !value,)}
                  hitSlop={8}
                >
                  <Ionicons
                    name={showNewPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={21}
                    color="#94a3b8"
                  />
                </Pressable>
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={t('settings.confirmPassword',)}
                  placeholderTextColor="#64748b"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={onConfirmPasswordChange}
                  autoCapitalize="none"
                />

                <Pressable
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword((value) => !value,)}
                  hitSlop={8}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={21}
                    color="#94a3b8"
                  />
                </Pressable>
              </View>

              <Pressable
                style={styles.saveButton}
                onPress={handleChangePassword}
              >
                <Text style={styles.saveButtonText}>
                  {t('settings.changePassword',)}
                </Text>
              </Pressable>
            </>
          )}

          {modalType === 'logout' && (
            <View style={styles.confirmContent}>
              <View style={styles.confirmIcon}>
                <Ionicons
                  name="log-out-outline"
                  size={32}
                  color="#38bdf8"
                />
              </View>

              <Text style={styles.confirmTitle}>
                {t('settings.logout')}
              </Text>
              <Text style={styles.confirmMessage}>
                {t('settings.logoutConfirmation',)}
              </Text>

              <View style={styles.confirmActions}>
                <Pressable
                  style={styles.cancelButton}
                  onPress={handleClose}
                >
                  <Text style={styles.cancelButtonText}>
                    {t('common.cancel')}
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.confirmButton}
                  onPress={onLogout}
                >
                  <Ionicons
                    name="log-out-outline"
                    size={19}
                    color="#0f172a"
                  />

                  <Text
                    style={
                      styles.confirmButtonText
                    }
                  >
                    {t('settings.logout')}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
          {modalType === 'delete' && (
            <View style={styles.confirmContent}>
              <View style={styles.deleteIcon}>
                <Ionicons
                  name="trash-outline"
                  size={32}
                  color="#ef4444"
                />
              </View>

              <Text style={styles.confirmTitle}>
                {t('settings.deleteAccount')}
              </Text>

              <Text
                style={styles.confirmMessage}
              >
                {t(
                  'settings.deleteAccountConfirmation',
                )}
              </Text>

              <View
                style={styles.confirmActions}
              >
                <Pressable
                  style={styles.cancelButton}
                  onPress={handleClose}
                >
                  <Text
                    style={
                      styles.cancelButtonText
                    }
                  >
                    {t('common.cancel')}
                  </Text>
                </Pressable>

                <Pressable
                  style={
                    styles.deleteConfirmButton
                  }
                  onPress={onDeleteAccount}
                >
                  <Ionicons
                    name="trash-outline"
                    size={19}
                    color="#ef4444"
                  />

                  <Text
                    style={
                      styles.deleteConfirmText
                    }
                  >
                    {t('common.delete')}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor:
      'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  modalContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor:
      'rgba(56, 189, 248, 0.15)',
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  modalTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '700',
  },

  textInput: {
    height: 52,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#f8fafc',
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor:
      'rgba(255, 255, 255, 0.08)',
  },

  inputWrapper: {
    height: 52,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor:
      'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
  },

  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    paddingRight: 8,
    color: '#f8fafc',
    fontSize: 16,
  },

  eyeButton: {
    width: 48,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },

  saveButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#38bdf8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  saveButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },

  confirmContent: {
    alignItems: 'center',
  },

  confirmIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor:
      'rgba(56, 189, 248, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  deleteIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor:
      'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  confirmTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },

  confirmMessage: {
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },

  confirmActions: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },

  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor:
      'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelButtonText: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '600',
  },

  confirmButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#38bdf8',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
  },

  confirmButtonText: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '700',
  },

  deleteConfirmButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor:
      'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor:
      'rgba(239, 68, 68, 0.3)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
  },

  deleteConfirmText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: '700',
  },
});
