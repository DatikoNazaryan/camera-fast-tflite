import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  image: string;
  name: string;
  confidence: number | null;
  onClose: () => void;
};

export default function RecognitionResult(props: Props) {
  const { image, name, confidence, onClose, } = props;

    return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <Ionicons
            name="close"
            size={26}
            color="#fff"
          />
        </TouchableOpacity>

        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.info}>
          <View style={styles.dot} />

          <View style={styles.textContainer}>
            <Text style={styles.name}>
              {name}
            </Text>

            {confidence !== null && (
              <Text style={styles.confidence}>
                {Math.min(
                  100,
                  Math.round(confidence),
                )}
                %
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 50,
  },

  card: {
    width: '100%',
    borderRadius: 28,
    backgroundColor: '#1e293b',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },

  image: {
    width: '100%',
    aspectRatio: 1,
  },

  closeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  info: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#38bdf8',
    marginRight: 12,
  },

  textContainer: {
    flex: 1,
  },

  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },

  confidence: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 4,
  },
});
