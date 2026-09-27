import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const BOX_SIZE = width * 0.7;

export const RECOGNITION_DELAY = 1500;

export const CAMERA_FPS = 2;

export const MODEL_INPUT_SIZE = 224;