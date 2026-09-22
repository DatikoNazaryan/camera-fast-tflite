import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = TouchableOpacityProps & {
  value: boolean;
  iconStyle?: StyleProp<TextStyle>;
  checkboxStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

function CheckBox(props: Props) {
  const { style, onPress, checkboxStyle, value, iconStyle, children, disabled, ...rest } = props;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
      {...rest}
      style={[styles.container, disabled ? styles.disabled : null, style]}
    >
      {children}
      <View style={[styles.checkBox, checkboxStyle, value && !disabled ? styles.checkedBox : null]}>
        {value && (
          <Ionicons
            name="checkmark"
            size={14}
            color="#FFF"
            style={iconStyle}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabled: {
    opacity: 0.5,
  },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderWidth: 2,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  checkedBox: {
    borderRadius: 6,
    borderColor: '#38bdf8',
    borderWidth: 0,
    backgroundColor: '#0284c7',
  },
});

export default CheckBox;