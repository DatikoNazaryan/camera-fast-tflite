import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextProps,
  TouchableOpacityProps,
  View,
  TextStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export type InputButtonProps = TouchableOpacityProps & {
  textStyle?: TextProps['style'];
  errorStyle?: TextProps['style'];
  error?: string | null | undefined;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconRight?: keyof typeof MaterialIcons.glyphMap;
  loading?: boolean;
  border?: boolean;
  iconSize?: number;
  textProps?: TextProps;
  iconStyle?: TextStyle;
  iconColor?: string;
  width?: number | string;
  height?: number | string;
  rightIconPress?: () => void;
};

function InputButton(props: InputButtonProps) {
  const {
    error,
    children,
    loading,
    icon,
    iconRight,
    textStyle,
    style,
    errorStyle,
    border = true,
    textProps = {},
    iconStyle,
    iconColor,
    iconSize = 13,
    rightIconPress,
    ...ext
  } = props;

  return (
    <Pressable
      {...ext}
      style={[
        styles.wrapper,
        typeof error === 'string'
          ? { borderColor: 'red' }
          : null,
        !border
          ? { borderColor: 'transparent' }
          : null,
        icon
          ? {
            paddingLeft: 6,
            paddingRight: 12,
          }
          : {
            paddingHorizontal: 12,
          },
        iconRight
          ? {
            paddingLeft: 12,
            paddingRight: 6,
          }
          : {
            paddingHorizontal: 12,
          },
        style,
      ]}
    >
      {loading ? (
        <View
          style={[
            styles.icon,
            !icon
              ? {
                width: 0,
                marginLeft: -15,
                marginRight: 15,
              }
              : null,
          ]}
        >
          <ActivityIndicator color="#443A95"/>
        </View>
      ) : null}

      {icon && !loading ? (
        <MaterialIcons
          name={icon}
          size={iconSize}
          color={iconColor ?? '#FFF'}
          style={[styles.icon, iconStyle]}
        />
      ) : null}

      <Text
        numberOfLines={1}
        allowFontScaling={false}
        {...textProps}
        style={[styles.text, textStyle]}
      >
        {children}
      </Text>

      {iconRight ? (
        <Pressable onPress={rightIconPress}>
          <MaterialIcons
            name={iconRight}
            size={iconSize}
            color={iconColor ?? '#443A95'}
            style={[styles.iconRight, iconStyle]}
          />
        </Pressable>
      ) : null}

      {error ? (
        <Text
          allowFontScaling={false}
          style={[styles.textError, errorStyle]}
        >
          {error}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1EFFE',
    flexShrink: 0,
  },

  text: {
    fontFamily: 'NotoSansArmenian-Medium',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: -0.1,
    textAlign: 'center',
    color: '#FFF',
    height: '100%',
    flexShrink: 0,
  },

  textError: {
    color: 'red',
    position: 'absolute',
    fontFamily: 'NotoSansArmenian',
    bottom: -20,
    fontSize: 12,
    textAlign: 'center',
    left: 0,
    right: 0,
  },

  icon: {
    marginRight: 5,
    marginBottom: 18
  },

  iconRight: {
    marginLeft: 5,
  },
});

export default InputButton;
