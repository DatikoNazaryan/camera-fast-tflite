import { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from "react-native";
import {
  Camera,
  runAtTargetFps,
  useCameraDevice,
  useFrameProcessor,
  useCameraPermission
} from "react-native-vision-camera";
import { useTensorflowModel } from "react-native-fast-tflite";
import { useResizePlugin } from "vision-camera-resize-plugin";
import labelEn from '@/assets/lables/labelsEn.json';
import labelRu from '@/assets/lables/labelsRu.json';
import labelHy from '@/assets/lables/labelsHy.json';
import { useRunOnJS } from "react-native-worklets-core";
import { CONFIDENCE_THRESHOLD } from '@/src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useRouter } from 'expo-router';
import i18n from 'i18next';
import { useTranslation } from "react-i18next";

type Label = {
  id: number;
  name: string;
};

const { width } = Dimensions.get('window');
const BOX_SIZE = width * 0.9;

export default function CameraScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const objectDetection = useTensorflowModel(require('@/assets/model/my-model.tflite'));
  const model = objectDetection.state === "loaded" ? objectDetection.model : undefined;
  const { resize } = useResizePlugin();
  const labels: Label[] = i18n.language === 'ru' ? labelRu : i18n.language === 'en' ? labelEn : labelHy;
  const [predictedValue, setPredictedValue] = useState<string | null>(t("searching"));
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const lastSpokenRef = useRef<string>("");
  const runOnJS = useRunOnJS(setPredictedValue, []);
  const searchingText = t('searching');
  const unknownText = t('unknown');

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  // useEffect(() => {
  //   Speech.getAvailableVoicesAsync().then((voices) => {
  //     const languages = {
  //       en: voices.filter((voice) => voice.language.startsWith('en')),
  //       ru: voices.filter((voice) => voice.language.startsWith('ru')),
  //       hy: voices.filter((voice) => voice.language.startsWith('hy')),
  //     };
  //
  //     console.log('EN:', languages.en);
  //     console.log('RU:', languages.ru);
  //     console.log('HY:', languages.hy);
  //   });
  // }, []);

  const speakResult = (text: string) => {
    if (
      !isSpeechEnabled ||
      text === t("searching") ||
      text === lastSpokenRef.current
    ) {
      return;
    }

    lastSpokenRef.current = text;

    const speechLanguage =
      i18n.language === 'hy'
        ? 'ru-RU'
        : i18n.language === 'ru'
          ? 'ru-RU'
          : 'en-US';

    Speech.stop();

    Speech.speak(text, {
      language: speechLanguage,
      rate: 0.9,
    });
  };

  const handleSpeechRun = useRunOnJS(speakResult, [isSpeechEnabled]);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';

    if (!model) return;

    runAtTargetFps(2, () => {
      'worklet';

      const resized = resize(frame, {
        scale: { width: 224, height: 224 },
        pixelFormat: 'rgb',
        dataType: 'uint8',
      });

      const outputs = model.runSync([resized]) as Float32Array[];
      const logits = outputs[0];

      let maxIndex = 0;
      let maxValue = logits[0];
      for (let i = 1; i < logits.length; i++) {
        if (logits[i] > maxValue) {
          maxValue = logits[i];
          maxIndex = i;
        }
      }

      if (maxValue > CONFIDENCE_THRESHOLD) {
        let name = labels[maxIndex]?.name ?? unknownText;

        if (name.toLowerCase() === "furniture") {
          name = searchingText;
        }

        runOnJS(name);
        handleSpeechRun(name);
      } else {
        runOnJS(searchingText);
      }
    })
  }, [model, isSpeechEnabled]);

  if (!hasPermission) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="camera-outline" size={64} color="#38bdf8" style={{ marginBottom: 16 }} />
        <Text style={styles.errorText}>{t('cameraPermissionMissing')}</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>{t('allowCameraAccess')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>{t('cameraNotFound')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        frameProcessor={frameProcessor}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />

      <View style={styles.overlayContainer} pointerEvents="none">
        <View style={styles.scanBox}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
        <Text style={styles.instructionText}>{t('placeObjectInsideBox')}</Text>
      </View>

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setIsSpeechEnabled(!isSpeechEnabled)}
        >
          <Ionicons
            name={isSpeechEnabled ? "volume-high" : "volume-mute"}
            size={24}
            color={isSpeechEnabled ? "#38bdf8" : "#94a3b8"}
          />
        </TouchableOpacity>
      </View>

      {predictedValue !== null && (
        <View style={styles.labelContainer}>
          <View style={styles.pulseDot} />
          <Text style={styles.labelText}>{predictedValue}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 24,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  topBar: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 18
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
  instructionText: {
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
  labelContainer: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    zIndex: 10,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#38bdf8',
    marginRight: 12,
  },
  labelText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
  },
});
