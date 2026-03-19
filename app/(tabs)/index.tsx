import { Text, StyleSheet, Pressable, View } from 'react-native';
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => router.push("/camera")}
      >
        <Text style={{ color: "#FFF" }}>Go Camera</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
