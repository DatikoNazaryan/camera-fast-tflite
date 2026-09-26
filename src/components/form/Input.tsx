import React, { Ref, useCallback, useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewProps,
  Text,
  ActivityIndicator,
  TextProps,
} from 'react-native';
import { FocusEvent, BlurEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { BottomSheetTextInputProps } from '@gorhom/bottom-sheet/src/components/bottomSheetTextInput';
import { Ionicons } from '@expo/vector-icons';

export type InputProps = BottomSheetTextInputProps & TextInputProps & {
  wrapperStyle?: ViewProps['style'];
  iconRightStyle?: ViewProps['style'];
  labelStyle?: TextProps['style'];
  iconLeft?: string,
  iconRight?: string,
  error?: string | null,
  label?: string,
  placeholderText?: string,
  iconSize?: number,
  onIconLeftPress?: () => void,
  onIconRightPress?: () => void,
  ref?: Ref<TextInput>
  Component?: typeof TextInput | typeof BottomSheetTextInput,
  loading?: boolean,
  inputProps?: Record<string, any>;
  width?: number;
  height?: number;
  iconColor?: string;
  placeholder?: string,
  disableFocusStyle?: boolean,
  inputType?: string,
};

function Input(props: InputProps) {
  const {
    Component = TextInput,
    ref,
    wrapperStyle,
    iconRight,
    iconLeft,
    onIconRightPress,
    onIconLeftPress,
    disableFocusStyle,
    placeholder,
    error,
    style,
    label,
    iconSize = 24,
    loading,
    iconRightStyle,
    labelStyle,
    onFocus,
    onBlur,
    value,
    width,
    height,
    iconColor,
    inputType,
    ...ext
  } = props;
  const [isFocused, setFocused] = useState(false);

  const defaultRef = useRef<TextInput>(null);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return undefined;
    }

    const listener = Keyboard.addListener('keyboardDidHide', () => {
      const input = ((ref as typeof defaultRef) || defaultRef).current;

      if (input?.isFocused()) {
        input.blur();
      }
    });

    return () => {
      listener.remove();
    };
  }, [ref]);

  const handleFocus = useCallback((ev: FocusEvent) => {
    if (!disableFocusStyle) {
      setFocused(true);
    }

    if (onFocus) onFocus(ev);
  }, [disableFocusStyle, onFocus]);

  const handleBlur = useCallback((ev: BlurEvent) => {
    setFocused(false);
    if (onBlur) onBlur(ev);
  }, [onBlur]);

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      {label ? (
        <Text numberOfLines={1} style={[styles.label, isFocused || value ? styles.labelFocused : null, labelStyle]}>
          {label}
        </Text>
      ) : null}

      <View style={[
        styles.outerHalo,
        isFocused ? styles.outerHaloFocused : null,
        error ? styles.outerHaloError : null,
      ]}
      >
        {iconLeft ? (
          <TouchableOpacity style={styles.iconLeft} disabled={!onIconLeftPress} onPress={onIconLeftPress}>
            <Ionicons
              size={iconSize}
              name={iconLeft as keyof typeof Ionicons.glyphMap}
              color={iconColor ?? '#38bdf8'}
            />
          </TouchableOpacity>
        ) : null}

        <Component
          ref={(ref || defaultRef) as any}
          value={value}
          keyboardType={inputType as any}
          allowFontScaling={false}
          placeholderTextColor="#64748b"
          style={[
            styles.input,
            iconLeft ? { paddingLeft: iconSize + 16 } : null,
            iconRight || loading ? { paddingRight: iconSize + 16 } : null,
            isFocused ? styles.inputFocused : null,
            error ? styles.inputError : null,
            style,
          ]}
          cursorColor="#38bdf8"
          selectionColor="#38bdf8"
          {...ext}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCorrect={false}
          placeholder={placeholder}
        />

        {iconRight && !loading ? (
          <TouchableOpacity style={[styles.iconRight, iconRightStyle]} disabled={!onIconRightPress} onPress={onIconRightPress}>
            <Ionicons
              size={iconSize}
              name={iconRight as keyof typeof Ionicons.glyphMap}
              color={iconColor ?? '#38bdf8'}
            />
          </TouchableOpacity>
        ) : null}
        {loading ? (
          <View style={styles.iconRight}>
            <ActivityIndicator size="small" color="#38bdf8" />
          </View>
        ) : null}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
  },
  outerHalo: {
    padding: 2,
    borderRadius: 16,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  outerHaloFocused: {
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderRadius: 16,
  },
  outerHaloError: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    borderStyle: 'solid',
    borderRadius: 16,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#f8fafc',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
  },
  inputFocused: {
    borderColor: '#38bdf8',
    borderWidth: 1.5,
  },
  iconLeft: {
    position: 'absolute',
    top: 4,
    left: 4,
    height: 52,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  iconRight: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 2,
    height: 52,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: 13,
    color: '#ef4444',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  label: {
    backgroundColor: '#1e293b',
    zIndex: 3,
    position: 'absolute',
    top: -8,
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
    left: 16,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  labelFocused: {
    color: '#38bdf8',
  },
});

export default Input;
