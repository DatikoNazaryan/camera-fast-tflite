import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  isSpeechEnabled: boolean;
  onBack: () => void;
  onToggleSpeech: () => void;
};

export default function CameraTopBar({
  isSpeechEnabled,
  onBack,
  onToggleSpeech,
}: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onBack}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color="#fff"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={onToggleSpeech}
      >
        <Ionicons
          name={
            isSpeechEnabled
              ? 'volume-high'
              : 'volume-mute'
          }
          size={24}
          color={
            isSpeechEnabled
              ? '#38bdf8'
              : '#94a3b8'
          }
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },

  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
});
