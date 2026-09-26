import React from 'react';
import {
  StyleSheet,
  TextStyle,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  View,
} from 'react-native';

type Props = TouchableOpacityProps & {
  textStyle?: TextStyle;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  loaderColor?: string;
};

function Button(props: Props) {
  const {
    children,
    style,
    textStyle,
    iconLeft,
    iconRight,
    loading,
    loaderColor = '#ffffff',
    ...rest
  } = props;

  const hasLeft = !!iconLeft;
  const hasRight = !!iconRight || !!loading;

  return (
    <TouchableOpacity
      {...rest}
      style={[styles.button, rest.disabled && styles.disabled, style]}
      disabled={loading || rest.disabled}
      activeOpacity={0.85}
    >
      {hasLeft ? <View style={styles.side}>{iconLeft}</View> : null}

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={loaderColor}
            style={styles.loader}
          />
        ) : (
          <Text style={[styles.text, textStyle]} numberOfLines={1}>
            {children}
          </Text>
        )}
      </View>

      {hasRight && (
        <View style={styles.side}>
          {!loading ? iconRight : null}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#0284c7',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,                // Android-ի ստվեր
  },
  disabled: {
    opacity: 0.6,
  },
  side: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  loader: {
    marginLeft: 0,
  },
});

export default Button;
