import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import InputButton from '@src/components/form/InputButton';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import FilePicker, { PickFileMultiple } from '@src/utils/FilePicker';

type ParamsType = {
  options?: ImagePicker.ImagePickerOptions;
  resolve: (variant: PickFileMultiple) => void;
};

export type PickerType = 'image' | 'take-photo';

function FilePickerModal() {
  const { t } = useTranslation();
  const modalRef = useRef<BottomSheetModal>(null);
  const [params, setParams] = useState<ParamsType | null>(null);

  FilePickerModal.pick = useCallback(
    (options?: ImagePicker.ImagePickerOptions) =>
      new Promise(resolve => {
        setParams({ resolve, options });
        modalRef.current?.present();
      }),
    [],
  );

  const snapPoints = useMemo(() => [200], []);

  const onClose = useCallback(() => {
    params?.resolve({
      canceled: true,
      files: [],
    });

    setParams(null);
  }, [params]);

  const handlePress = useCallback(
    (type: PickerType) => async () => {
      const data = await FilePicker.pick(
        type,
        params?.options,
      );

      if (!data.canceled) {
        params?.resolve(data);
        setParams(null);
        modalRef.current?.dismiss();
      }
    },
    [params],
  );

  return (
    <BottomSheetModal
      snapPoints={snapPoints}
      ref={modalRef}
      onDismiss={onClose}
      enableDynamicSizing={false}
      animationConfigs={{ duration: 200 }}
      handleIndicatorStyle={{
        backgroundColor: '#FFFFFF',
        width: 40,
      }}
      backdropComponent={d => (
        <BottomSheetBackdrop
          {...d}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
      backgroundComponent={() => (
        <LinearGradient
          colors={['#0B1020', '#17152F', '#241F4A',]}
          style={StyleSheet.absoluteFill}
        />
      )}
      stackBehavior="push"
    >
      <BottomSheetView style={styles.content}>
        <InputButton
          iconStyle={{ marginRight: 10 }}
          style={styles.button}
          icon="photo-library"
          onPress={handlePress('image')}
        >
          {t('Photo Library')}
        </InputButton>

        <InputButton
          iconStyle={{ marginRight: 10 }}
          style={styles.button}
          icon="camera-alt"
          onPress={handlePress('take-photo')}
        >
          {t('Take a Photo')}
        </InputButton>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: '4%',
    paddingTop: 10,
    paddingBottom: 20,
  },

  button: {
    height: 50,
    borderRadius: 0,
    borderColor: 'transparent',
    borderBottomColor: '#334155',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

FilePickerModal.pick = (
  options?: ImagePicker.ImagePickerOptions,
): Promise<PickFileMultiple> => {
  throw Error('FilePickerModal is not initialized.');
};

export default FilePickerModal;