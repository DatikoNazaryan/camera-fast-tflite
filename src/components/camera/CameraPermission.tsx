import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

type Props = {
  onRequestPermission: () => void;
};

export default function CameraPermission({
  onRequestPermission,
}: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Ionicons
        name="camera-outline"
        size={64}
        color="#38bdf8"
        style={styles.icon}
      />

      <Text style={styles.errorText}>
        {t('cameraPermissionMissing')}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={onRequestPermission}
      >
        <Text style={styles.buttonText}>
          {t('allowCameraAccess')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 24,
  },

  icon: {
    marginBottom: 16,
  },

  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});