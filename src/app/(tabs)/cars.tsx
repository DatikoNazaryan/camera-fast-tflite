import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
  runAtTargetFps,
} from 'react-native-vision-camera';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { Worklets } from 'react-native-worklets-core';
import labels from '@/assets/lables/carLabels.json';

const { width } = Dimensions.get('window');

const MODEL_INPUT_SIZE = 224;
const CONFIDENCE_THRESHOLD = 0.1;

export default function CarsScreen() {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [prediction, setPrediction] = useState<{
    label: string;
    confidence: number;
  } | null>(null);
  const model = useTensorflowModel(require('@/assets/model/car_classifier.tflite'));
  const { resize } = useResizePlugin();

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const updatePrediction = Worklets.createRunOnJS(
    (index: number, confidence: number) => {
      const label = labels[index];

      if (!label || confidence < CONFIDENCE_THRESHOLD) {
        setPrediction(null);
        return;
      }

      setPrediction({
        label,
        confidence,
      });
    },
  );

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';

      runAtTargetFps(2, () => {
        'worklet';

        if (model.state !== 'loaded') {
          return;
        }

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
            width: MODEL_INPUT_SIZE,
            height: MODEL_INPUT_SIZE,
          },
          pixelFormat: 'rgb',
          dataType: 'float32',
        });

        const outputs = model.model.runSync([resized]) as Float32Array[];
        const output = outputs[0];

        if (!output || output.length === 0) {
          return;
        }

        let maxIndex = 0;
        let maxConfidence = Number(output[0]);

        for (let i = 1; i < output.length; i += 1) {
          const confidence = Number(output[i]);

          if (confidence > maxConfidence) {
            maxConfidence = confidence;
            maxIndex = i;
          }
        }

        updatePrediction(maxIndex, maxConfidence);
      });
    },
    [model, resize, updatePrediction],
  );

  if (!device) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Camera is not available</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Camera permission is required</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive
        frameProcessor={frameProcessor}
      />

      <View style={styles.overlay}>
        <View style={styles.scanBox} />

        {prediction && (
          <View style={styles.result}>
            <Text style={styles.label}>{prediction.label}</Text>
            <Text style={styles.confidence}>
              {(prediction.confidence * 100).toFixed(1)}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#020617',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBox: {
    width: width * 0.7,
    height: width * 0.7,
    borderWidth: 2,
    borderColor: '#38bdf8',
    borderRadius: 20,
  },
  result: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  label: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  confidence: {
    color: '#38bdf8',
    fontSize: 15,
    marginTop: 6,
    textAlign: 'center',
  },
});
