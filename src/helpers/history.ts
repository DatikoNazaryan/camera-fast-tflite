import {
  createRecognitionRequest,
} from '@/src/store/actions/recognitionAction';

import {
  useAppDispatch,
} from '@src/store';

import { File } from 'expo-file-system';

const saveRecognition = async (
  dispatch: ReturnType<typeof useAppDispatch>,
  name: string,
  confidence: number,
  imageUri?: string,
) => {
  try {
    if (!imageUri) {
      throw new Error(
        'Image URI is required',
      );
    }

    const recognition =
      await dispatch(
        createRecognitionRequest({
          name,
          confidence,
          image: new File(imageUri),
        }),
      ).unwrap();

    return recognition;
  } catch (error) {
    console.error(
      'Failed to save recognition:',
      error,
    );

    throw error;
  }
};

export default saveRecognition;
