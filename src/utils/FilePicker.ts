import * as ImagePicker from 'expo-image-picker';
import { File } from 'expo-file-system';
import { t } from 'i18next';
import Toast from 'react-native-simple-toast';
import { Linking, Platform } from 'react-native';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

export type PickerType = 'image' | 'video' | 'take-photo';

export type PickFileMultiple = {
  canceled: boolean,
  files: File[]
};

class FilePicker {
  static async pick(type: PickerType, options?: ImagePicker.ImagePickerOptions): Promise<PickFileMultiple> {
    switch (type) {
      case 'image':
        return this.pickMedia(['images'], options);
      case 'video':
        return this.pickMedia(['videos'], options);
      case 'take-photo':
        return this.takePhoto(['images'], options);
      default:
        throw Error('Media type not supported');
    }
  }

  static async imageToPng(asset: ImagePicker.ImagePickerAsset): Promise<ImagePicker.ImagePickerAsset> {
    const image = ImageManipulator.manipulate(asset.uri);
    const result = await image.renderAsync();
    const saved = await result.saveAsync({
      format: SaveFormat.JPEG,
      compress: 0.9,
    });
    return {
      mimeType: 'jpeg',
      type: 'image',
      uri: saved.uri,
      width: saved.width,
      height: saved.height,
    };
  }

  static async assetsToFiles(assets?: ImagePicker.ImagePickerAsset[] | null): Promise<File[]> {
    if (!assets) {
      return [];
    }

    await Promise.all(
      assets.map(async (asset, i) => {
        if (asset.mimeType === 'image/heic') {
          assets[i] = await this.imageToPng(asset);
        }
      })
    );

    return assets.map(this.formatAssetAsFile);
  }

  static openPermissionSettings() {
    if (Platform.OS === 'android') {
      Linking.openSettings().catch(console.error);
    }
  }

  static async pickMedia(mediaType: ImagePicker.MediaType[], options: ImagePicker.ImagePickerOptions = {}): Promise<PickFileMultiple> {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Toast.show(t('Permission denied to access media library'), Toast.LONG);
      setTimeout(this.openPermissionSettings, 1000);
      return {
        files: [],
        canceled: true,
      };
    }
    const { canceled, assets } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mediaType,
      selectionLimit: 20,
      quality: 0.9,
      ...options,
    });

    return {
      files: await this.assetsToFiles(assets),
      canceled,
    };
  }

  static async takePhoto(mediaType: ImagePicker.MediaType[], options: ImagePicker.ImagePickerOptions = {}): Promise<PickFileMultiple> {
    try {
      const { granted } = await ImagePicker.requestCameraPermissionsAsync();
      if (!granted) {
        Toast.show(t('Permission denied to access camera'), Toast.LONG);
        setTimeout(this.openPermissionSettings, 1000);
        return {
          files: [],
          canceled: true,
        };
      }

      const { canceled, assets } = await ImagePicker.launchCameraAsync({
        mediaTypes: mediaType,
        cameraType: ImagePicker.CameraType.back,
        selectionLimit: 20,
        ...options,
      });

      return {
        files: await this.assetsToFiles(assets),
        canceled,
      };
    } catch (e: Error | any) {
      if (e.message === 'Camera not available on simulator') {
        return this.pickMedia(mediaType, options);
      }
      throw e;
    }
  }

  static formatAssetAsFile = (asset: ImagePicker.ImagePickerAsset): File => new File(asset.uri);

  static formatPathAsFile = async (path: string): Promise<File> => {
    let uri = path;
    if (!uri.startsWith('file://')) {
      uri = `file://${uri}`;
    }
    return new File(uri);
  };
}

export default FilePicker;
