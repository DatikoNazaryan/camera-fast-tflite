import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { BOX_SIZE } from '@/src/constants/camera';

export default function ScanOverlay() {
  const { t } = useTranslation();

  return (
    <View style={styles.overlay} pointerEvents="none">
      <View style={styles.scanBox}>
        <View style={[styles.corner, styles.topLeft,]}/>
        <View style={[styles.corner, styles.topRight,]}/>
        <View style={[styles.corner, styles.bottomLeft,]}/>
        <View style={[styles.corner, styles.bottomRight,]}/>
      </View>

      <Text style={styles.instruction}>
        {t('placeObjectInsideBox')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 18,
  },

  scanBox: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    borderRadius: 24,
    backgroundColor: 'transparent',
    position: 'relative',
  },

  instruction: {
    color: '#cbd5e1',
    fontSize: 14,
    marginTop: 20,
    fontWeight: '500',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    textAlign: 'center',
    overflow: 'hidden',
  },

  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#38bdf8',
  },

  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 20,
  },

  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 20,
  },

  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 20,
  },

  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 20,
  },
});
