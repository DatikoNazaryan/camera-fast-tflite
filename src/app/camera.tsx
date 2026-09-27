import {
  StyleSheet,
  View,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import CameraPermission from '@/src/components/camera/CameraPermission';
import CameraUnavailable from '@/src/components/camera/CameraUnavailable';
import CameraTopBar from '@/src/components/camera/CameraTopBar';
import ScanOverlay from '@/src/components/camera/ScanOverlay';
import RecognitionLabel from '@/src/components/camera/RecognitionLabel';
import RecognitionResult from '@/src/components/camera/RecognitionResult';
import { useObjectRecognition } from '@/src/hooks/useObjectRecognition';

export default function CameraScreen() {
  const router = useRouter();
  const { hasPermission, requestPermission, } = useCameraPermission();
  const device = useCameraDevice('back');
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const {
    cameraRef,
    frameProcessor,
    isScanning,
    predictedValue,
    recognizedImage,
    recognizedName,
    recognizedConfidence,
    resetScanner,
  } = useObjectRecognition({ isSpeechEnabled });

  if (!hasPermission) {
    return (
      <CameraPermission onRequestPermission={requestPermission}/>
    );
  }

  if (!device) {
    return <CameraUnavailable />;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        frameProcessor={frameProcessor}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isScanning}
        photo
      />

      {isScanning && (
        <>
          <ScanOverlay />

          <CameraTopBar
            isSpeechEnabled={
              isSpeechEnabled
            }
            onBack={() => router.back()}
            onToggleSpeech={() =>
              setIsSpeechEnabled(
                previous => !previous,
              )
            }
          />

          {predictedValue && (
            <RecognitionLabel
              value={predictedValue}
            />
          )}
        </>
      )}

      {!isScanning &&
        recognizedImage &&
        recognizedName && (
          <RecognitionResult
            image={recognizedImage}
            name={recognizedName}
            confidence={
              recognizedConfidence
            }
            onClose={resetScanner}
          />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
