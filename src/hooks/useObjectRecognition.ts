import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Platform } from 'react-native';
import { Camera, runAtTargetFps, useFrameProcessor } from 'react-native-vision-camera';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { useRunOnJS } from 'react-native-worklets-core';
import * as FileSystem from 'expo-file-system/legacy';
import i18n from 'i18next';
import labelEn from '@/assets/lables/labelsEn.json';
import labelRu from '@/assets/lables/labelsRu.json';
import labelHy from '@/assets/lables/labelsHy.json';
import { useAppDispatch } from '@src/store';
import { CONFIDENCE_THRESHOLD } from '@/src/constants/theme';
import {
  MODEL_INPUT_SIZE,
  RECOGNITION_DELAY,
} from '@/src/constants/camera';
import saveRecognition from '@/src/helpers/history';
import { NitroModules } from 'react-native-nitro-modules';
import { useRecognitionSpeech } from '@/src/hooks/useRecognitionSpeech';
import { useTranslation } from "react-i18next";

type Label = {
  id: number;
  name: string;
};

type PendingRecognition = {
  id: number;
  name: string;
  confidence: number;
};

type UseObjectRecognitionProps = {
  isSpeechEnabled: boolean;
};

export const useObjectRecognition = ({ isSpeechEnabled, }: UseObjectRecognitionProps) => {
  const { t } = useTranslation();
  const cameraRef = useRef<Camera>(null);
  const isCapturingRef = useRef(false);
  const recognitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRecognitionRef = useRef<PendingRecognition | null>(null);
  const lastRecognizedRef = useRef('');
  const dispatch = useAppDispatch();
  const [isScanning, setIsScanning] = useState(true);
  const [predictedValue, setPredictedValue] = useState<string | null>(null);
  const [recognizedImage, setRecognizedImage] = useState<string | null>(null);
  const [recognizedName, setRecognizedName] = useState<string | null>(null);
  const [recognizedConfidence, setRecognizedConfidence] = useState<number | null>(null);
  const objectDetection = useTensorflowModel(
    require('@/assets/model/my-model.tflite'),
    Platform.OS === 'ios' ? ['core-ml'] : [],
  );
  const model =
    objectDetection.state === 'loaded'
      ? objectDetection.model
      : undefined;

  const boxedModel = useMemo(
    () => (model ? NitroModules.box(model) : undefined),
    [model],
  );


  const { resize } = useResizePlugin();

  const { speak, stop: stopSpeech } =
    useRecognitionSpeech(
      isSpeechEnabled,
      i18n.language,
    );

  const labels: Label[] =
    i18n.language === 'ru'
      ? labelRu
      : i18n.language === 'en'
        ? labelEn
        : labelHy;

  const searchingText = t('searching');
  const unknownText = t('unknown');

  useEffect(() => {
    return () => {
      if (recognitionTimerRef.current) {
        clearTimeout(recognitionTimerRef.current);
      }
    };
  }, []);

  const setPredictedValueJS = useRunOnJS(
    setPredictedValue,
    [],
  );

  const handleRecognition = useCallback(
    async (
      id: number,
      name: string,
      confidence: number,
    ) => {
      if (isCapturingRef.current) {
        return;
      }

      const camera = cameraRef.current;

      if (!camera) {
        return;
      }

      isCapturingRef.current = true;

      try {
        void speak(id, name);

        const photo = await camera.takePhoto({
          enableShutterSound: false,
        });

        const filename =
          photo.path.split('/').pop() ||
          `recognition_${Date.now()}.jpg`;

        const permanentUri =
          `${FileSystem.documentDirectory}${filename}`;

        await FileSystem.copyAsync({
          from: `file://${photo.path}`,
          to: permanentUri,
        });

        setIsScanning(false);

        await saveRecognition(
          dispatch,
          name,
          confidence,
          permanentUri,
        );

        setRecognizedImage(permanentUri);
        setRecognizedName(name);
        setRecognizedConfidence(confidence);
      } catch (error) {
        console.error(
          'Failed to recognize object or save photo:',
          error,
        );

        isCapturingRef.current = false;
      }
    },
    [speak],
  );

  const handleRecognitionRun = useRunOnJS(
    (
      id: number,
      name: string,
      confidence: number,
    ) => {
      if (
        !isScanning ||
        isCapturingRef.current
      ) {
        return;
      }

      const currentRecognition =
        pendingRecognitionRef.current;

      if (currentRecognition?.name === name) {
        return;
      }

      if (recognitionTimerRef.current) {
        clearTimeout(
          recognitionTimerRef.current,
        );
      }

      pendingRecognitionRef.current = {
        id,
        name,
        confidence,
      };

      recognitionTimerRef.current = setTimeout(
        () => {
          const pending =
            pendingRecognitionRef.current;

          if (!pending) {
            return;
          }

          void handleRecognition(
            pending.id,
            pending.name,
            pending.confidence,
          );

          pendingRecognitionRef.current = null;
          recognitionTimerRef.current = null;
        },
        RECOGNITION_DELAY,
      );
    },
    [isScanning, handleRecognition],
  );

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';
      runAtTargetFps(2, () => {
        'worklet';


        if (!boxedModel || !isScanning) {
          return;
        }


        const tflite = boxedModel.unbox();

        const cropSize = Math.min(frame.width, frame.height);
        const cropX = (frame.width - cropSize) / 2;
        const cropY = (frame.height - cropSize) / 2;

        let resized = resize(frame, {
          crop: {
            x: cropX,
            y: cropY,
            width: cropSize,
            height: cropSize,
          },
          scale: {
            width: MODEL_INPUT_SIZE,
            height: MODEL_INPUT_SIZE,
          },
          rotation: '0deg',
          pixelFormat: 'rgb',
          dataType: 'uint8',
        });

        const inputBuffer = new ArrayBuffer(resized.byteLength);
        new Uint8Array(inputBuffer).set(resized);

        const outputs = tflite.runSync([inputBuffer]);
        const outputBuffer = outputs[0];

        if (!outputBuffer) {
          return;
        }

// Model output: uint8, shape [1, 631]
        const scores = new Uint8Array(outputBuffer);

        if (scores.length !== labels.length) {
          return;
        }

        let maxIndex = 0;
        let maxValue = 0;

        for (let i = 0; i < scores.length; i += 1) {
          if (scores[i] > maxValue) {
            maxValue = scores[i];
            maxIndex = i;
          }
        }

        const confidence = maxValue / 255;

        if (confidence > CONFIDENCE_THRESHOLD) {
          let name = labels[maxIndex]?.name ?? unknownText;

          if (name.toLowerCase() === 'furniture') {
            name = searchingText;
          }

          setPredictedValueJS(name);

          const label = labels[maxIndex];

          if (
            label &&
            name !== searchingText &&
            name !== unknownText &&
            name !== lastRecognizedRef.current
          ) {
            lastRecognizedRef.current = name;

            handleRecognitionRun(
              label.id,
              name,
              confidence,
            );
          }
        } else {
          setPredictedValueJS(searchingText);
        }
      });
    },
    [
      boxedModel,
      isScanning,
      resize,
      labels,
      searchingText,
      unknownText,
      setPredictedValueJS,
      handleRecognitionRun,
    ],
  );

  const resetScanner = useCallback(() => {
    if (recognitionTimerRef.current) {
      clearTimeout(
        recognitionTimerRef.current,
      );

      recognitionTimerRef.current = null;
    }

    pendingRecognitionRef.current = null;
    isCapturingRef.current = false;

    setRecognizedImage(null);
    setRecognizedName(null);
    setRecognizedConfidence(null);

    lastRecognizedRef.current = '';

    stopSpeech();

    setPredictedValue(searchingText);
    setIsScanning(true);
  }, [searchingText, stopSpeech]);

  return {
    cameraRef,
    frameProcessor,
    isScanning,
    predictedValue,
    recognizedImage,
    recognizedName,
    recognizedConfidence,
    resetScanner,
  };
};