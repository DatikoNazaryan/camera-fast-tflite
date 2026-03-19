import { registerRootComponent } from "expo";
import App from "./App";
import { AppRegistry, Platform } from "react-native";

registerRootComponent(App);

if (Platform.OS === 'android') {
  AppRegistry.registerComponent("shareExtensionAndroid", () => require('@src/share/ShareExtension.android').default);
}
