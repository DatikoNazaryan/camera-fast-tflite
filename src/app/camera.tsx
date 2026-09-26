import { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {
  Camera,
  runAtTargetFps,
  useCameraDevice,
  useFrameProcessor,
  useCameraPermission,
} from 'react-native-vision-camera';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import labelEn from '@/assets/lables/labelsEn.json';
import labelRu from '@/assets/lables/labelsRu.json';
import labelHy from '@/assets/lables/labelsHy.json';
import { useRunOnJS } from 'react-native-worklets-core';
import { CONFIDENCE_THRESHOLD } from '@/src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import * as FileSystem from 'expo-file-system/legacy';
import { useRouter } from 'expo-router';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import saveRecognition from '@/src/helpers/history';

type Label = {
  id: number;
  name: string;
};

const { width } = Dimensions.get('window');

const BOX_SIZE = width * 0.7;
const RECOGNITION_DELAY = 1500;

export default function CameraScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const objectDetection = useTensorflowModel(require('@/assets/model/my-model.tflite'),);
  const model =
    objectDetection.state === 'loaded'
      ? objectDetection.model
      : undefined;
  const { resize } = useResizePlugin();
  const labels: Label[] =
    i18n.language === 'ru'
      ? labelRu
      : i18n.language === 'en'
        ? labelEn
        : labelHy;
  const cameraRef = useRef<Camera>(null);
  const isCapturingRef = useRef(false);
  const recognitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRecognitionRef = useRef<{ name: string; confidence: number } | null>(null);
  const [recognizedImage, setRecognizedImage] = useState<string | null>(null);
  const [recognizedName, setRecognizedName] = useState<string | null>(null);
  const [recognizedConfidence, setRecognizedConfidence] = useState<number | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [predictedValue, setPredictedValue] = useState<string | null>(t('searching'));
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);

  const lastSpokenRef = useRef<string>('');
  const lastRecognizedRef = useRef<string>('');

  const setPredictedValueJS = useRunOnJS(setPredictedValue, []);
  const searchingText = t('searching');
  const unknownText = t('unknown');
  const checkSpeechLanguages = async () => {
    const languages = await Speech.getAvailableVoicesAsync();
    // const service = Speech.

    console.log(languages);
    console.log(
      'Available Speech Languages:',
      languages.map(voice => ({
        identifier: voice.identifier,
        language: voice.language,
        name: voice.name,
      })).filter(voice => voice.language.startsWith('hy')),
    );
  };


  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
    checkSpeechLanguages();
  }, [hasPermission, requestPermission]);

  const speakResult = (text: string) => {
    if (
      !isSpeechEnabled ||
      text === searchingText ||
      text === unknownText ||
      text === lastSpokenRef.current
    ) {
      return;
    }

    lastSpokenRef.current = text;

    const speechLanguage =
      i18n.language === 'hy'
        ? 'hy-AM'
        : i18n.language === 'ru'
          ? 'ru-RU'
          : 'en-US';

    Speech.stop();
    Speech.speak(text, {
      language: speechLanguage,
      rate: 0.9,
    });
  };

  const handleRecognition = async (name: string, confidence: number) => {
    if (isCapturingRef.current) return;

    const camera = cameraRef.current;
    if (!camera) return;

    isCapturingRef.current = true;

    try {
      speakResult(name);

      const photo = await camera.takePhoto({
        enableShutterSound: false,
      });

      if (photo) {
        const filename = photo.path.split('/').pop() || `recognition_${Date.now()}.jpg`;
        const permanentUri = `${FileSystem.documentDirectory}${filename}`;

        await FileSystem.copyAsync({
          from: `file://${photo.path}`,
          to: permanentUri,
        });

        setIsScanning(false);

        await saveRecognition(name, confidence, permanentUri);

        setRecognizedImage(permanentUri);
        setRecognizedName(name);
        setRecognizedConfidence(confidence);
      }
    } catch (error) {
      console.error('Failed to recognize object or save photo:', error);
      isCapturingRef.current = false;
    }
  };

  const handleRecognitionRun = useRunOnJS((name: string, confidence: number) => {
    if (!isScanning || isCapturingRef.current) return;

    const currentRecognition = pendingRecognitionRef.current;
    if (currentRecognition?.name === name) return;

    if (recognitionTimerRef.current) {
      clearTimeout(recognitionTimerRef.current);
    }

    pendingRecognitionRef.current = { name, confidence };

    recognitionTimerRef.current = setTimeout(() => {
      const pending = pendingRecognitionRef.current;
      if (!pending) return;
      handleRecognition(pending.name, pending.confidence);
      pendingRecognitionRef.current = null;
      recognitionTimerRef.current = null;
    }, RECOGNITION_DELAY);
  }, [isScanning]);

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';

      if (!model || !isScanning) return;

      runAtTargetFps(2, () => {
        'worklet';

        const cropSize = Math.min(frame.width, frame.height);
        const cropX = (frame.width - cropSize) / 2;
        const cropY = (frame.height - cropSize) / 2;

        const resized = resize(frame, {
          crop: {
            x: cropX,
            y: cropY,
            width: cropSize,
            height: cropSize,
          },
          scale: {
            width: 224,
            height: 224,
          },
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

          if (name.toLowerCase() === 'furniture') {
            name = searchingText;
          }

          setPredictedValueJS(name);

          if (
            name !== searchingText &&
            name !== unknownText &&
            name !== lastRecognizedRef.current
          ) {
            lastRecognizedRef.current = name;
            handleRecognitionRun(name, maxValue);
          }
        } else {
          setPredictedValueJS(searchingText);
        }
      });
    },
    [model, labels, isScanning]
  );

  const resetScanner = () => {
    if (recognitionTimerRef.current) {
      clearTimeout(recognitionTimerRef.current);
      recognitionTimerRef.current = null;
    }
    pendingRecognitionRef.current = null;
    isCapturingRef.current = false;
    setRecognizedImage(null);
    setRecognizedName(null);
    setRecognizedConfidence(null);
    lastRecognizedRef.current = '';
    lastSpokenRef.current = '';
    setPredictedValue(searchingText);
    setIsScanning(true);
  };

  if (!hasPermission) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="camera-outline" size={64} color="#38bdf8" style={{ marginBottom: 16 }}/>
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
        ref={cameraRef}
        frameProcessor={frameProcessor}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />

      {isScanning && (
        <>
          <View style={styles.overlayContainer} pointerEvents="none">
            <View style={styles.scanBox}>
              <View style={[styles.corner, styles.topLeft]}/>
              <View style={[styles.corner, styles.topRight]}/>
              <View style={[styles.corner, styles.bottomLeft]}/>
              <View style={[styles.corner, styles.bottomRight]}/>
            </View>

            <Text style={styles.instructionText}>{t('placeObjectInsideBox')}</Text>
          </View>

          <View style={styles.topBar}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff"/>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setIsSpeechEnabled(!isSpeechEnabled)}
            >
              <Ionicons
                name={isSpeechEnabled ? 'volume-high' : 'volume-mute'}
                size={24}
                color={isSpeechEnabled ? '#38bdf8' : '#94a3b8'}
              />
            </TouchableOpacity>
          </View>

          {predictedValue !== null && (
            <View style={styles.labelContainer}>
              <View style={styles.pulseDot}/>
              <Text style={styles.labelText}>{predictedValue}</Text>
            </View>
          )}
        </>
      )}

      {!isScanning && recognizedImage && recognizedName && (
        <View style={styles.resultOverlay}>
          <View style={styles.resultCard}>
            <TouchableOpacity style={styles.closeButton} onPress={resetScanner}>
              <Ionicons name="close" size={26} color="#fff"/>
            </TouchableOpacity>
            <Image source={{ uri: recognizedImage }} style={styles.resultImage} resizeMode="cover"/>
            <View style={styles.resultInfo}>
              <View style={styles.resultDot}/>
              <View style={styles.resultTextContainer}>
                <Text style={styles.resultName}>{recognizedName}</Text>
                {recognizedConfidence !== null && (
                  <Text style={styles.resultConfidence}>
                    {Math.round(recognizedConfidence)}%
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 24
  },
  loadingText: {
    color: '#fff',
    fontSize: 16
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20
  },
  permissionButton: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  topBar: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)'
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
    position: 'relative'
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
    overflow: 'hidden'
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#38bdf8'
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 20
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 20
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 20
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 20
  },
  labelContainer: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    zIndex: 10
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#38bdf8',
    marginRight: 12
  },
  labelText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600'
  },
  resultOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 50
  },
  resultCard: {
    width: '100%',
    borderRadius: 28,
    backgroundColor: '#1e293b',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)'
  },
  resultImage: { width: '100%', aspectRatio: 1 },
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
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  resultInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18
  },
  resultDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#38bdf8', marginRight: 12
  },
  resultTextContext: {
    flex: 1
  },
  resultName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700'
  },
  resultConfidence: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 4
  },
  resultTextContainer: {}
});