import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  value: string;
};

export default function RecognitionLabel({
  value,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.dot} />

      <Text style={styles.text}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    zIndex: 10,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#38bdf8',
    marginRight: 12,
  },

  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
});
