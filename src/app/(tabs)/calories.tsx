import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

export default function CaloriesScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const [foodInfo, setFoodInfo] = useState<string>(t("foodNotDetected"));

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);

  if (!hasPermission || !device) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>{t("cameraNotFound")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={StyleSheet.absoluteFill} device={device} isActive={true}/>

      <View style={styles.topBar}>
        <Text style={styles.screenTitle}>{t("calorieCalculation")}</Text>
      </View>

      <View style={[styles.labelContainer, { bottom: safeAreaInsets.bottom + 90 }]}>
        <Ionicons name="nutrition" size={24} color="#38bdf8" style={{ marginRight: 10 }}/>
        <Text style={styles.labelText}>{foodInfo}</Text>
      </View>
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
    backgroundColor: '#0f172a'
  },
  loadingText: {
    color: '#fff',
    fontSize: 16
  },
  topBar: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 10
  },
  screenTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  labelContainer: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)'
  },
  labelText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600"
  },
});