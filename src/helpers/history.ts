import secureStorage from '@/src/utils/secureStorage';

const RECOGNITION_HISTORY_KEY = 'recognition.history';

export type RecognitionItem = {
  id: string;
  name: string;
  confidence: number;
  imageUri?: string;
  createdAt: string;
};

const saveRecognition = async (
  name: string,
  confidence: number,
  imageUri?: string,
) => {
  try {
    const history =
      (await secureStorage.getArrayAsync<RecognitionItem>(
        RECOGNITION_HISTORY_KEY,
      )) ?? [];

    const newItem: RecognitionItem = {
      id: `${Date.now()}-${Math.random()}`,
      name,
      confidence,
      imageUri,
      createdAt: new Date().toISOString(),
    };

    await secureStorage.setArrayAsync(
      RECOGNITION_HISTORY_KEY,
      [newItem, ...history],
    );
  } catch (error) {
    console.error('Failed to save recognition:', error);
  }
};

export default saveRecognition;