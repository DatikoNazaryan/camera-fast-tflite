import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  Camera,
  runAtTargetFps,
  useCameraDevice,
  useFrameProcessor
} from "react-native-vision-camera";
import { useTensorflowModel } from "react-native-fast-tflite";
import { useResizePlugin } from "vision-camera-resize-plugin";
import labelmap from '@/assets/labels.json';
import { useRunOnJS } from "react-native-worklets-core";
import { CONFIDENCE_THRESHOLD } from "@/constants/theme"

type Label = {
  id: number;
  name: string;
};

export default function CameraScreen() {
  const device = useCameraDevice('back');
  const objectDetection = useTensorflowModel(require('@/assets/my-model.tflite'));
  const model = objectDetection.state === "loaded" ? objectDetection.model : undefined;
  const { resize } = useResizePlugin();
  const labels = labelmap as Label[];
  const [predictedValue, setPredictedValue] = useState<string | null>(null);
  const runOnJS = useRunOnJS(setPredictedValue, []);

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
        const name = labels[maxIndex]?.name ?? "Unknown";
        runOnJS(name);
      } else {
        runOnJS("Searching...");
      }
    })
  }, [model]);

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>Loading camera...</Text>
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
      {predictedValue !== null && (
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>{predictedValue}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  labelContainer: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  labelText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
});
