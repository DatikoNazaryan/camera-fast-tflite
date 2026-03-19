import 'react-native-reanimated';
import React, { Component } from 'react';
import { App as RouterApp } from 'expo-router/build/qualified-entry';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


import { SafeAreaProvider } from "react-native-safe-area-context";

class App extends Component {
  render() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
              <RouterApp />
          </SafeAreaProvider>
        </GestureHandlerRootView>
    );
  }
}

export default App;
