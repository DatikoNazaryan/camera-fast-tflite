import { useCallback, useLayoutEffect, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';
import { hyClips } from '@/src/services/tts/hyClips';

export function useRecognitionSpeech(enabled: boolean, language: string) {
  const player = useAudioPlayer(null);
  const enabledRef = useRef(enabled);
  const requestRef = useRef(0);
  const focusedRef = useRef(false);
  const mountedRef = useRef(true);
  const lastSpokenRef = useRef('');

  const stop = useCallback(() => {
    requestRef.current += 1;
    lastSpokenRef.current = '';
    if (mountedRef.current) player.pause();
    void Speech.stop().catch(error => console.warn('Could not stop speech:', error));
  }, [player]);

  // Stop before useAudioPlayer releases its native object in passive cleanup.
  useLayoutEffect(() => {
    mountedRef.current = true;
    return () => {
      stop();
      mountedRef.current = false;
    };
  }, [stop]);

  useFocusEffect(useCallback(() => {
    focusedRef.current = true;
    return () => {
      focusedRef.current = false;
      stop();
    };
  }, [stop]));

  useLayoutEffect(() => {
    enabledRef.current = enabled;
    stop();
  }, [enabled, language, stop]);

  const speak = useCallback(async (id: number, text: string) => {
    const utterance = `${language}:${id}`;
    if (!enabledRef.current || !focusedRef.current || lastSpokenRef.current === utterance) return;
    const request = ++requestRef.current;
    lastSpokenRef.current = utterance;
    try {
      player.pause();
      await Speech.stop();
      const isArmenian = language !== 'en' && language !== 'ru';
      if (isArmenian) {
        await setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: false });
      }
      if (request !== requestRef.current || !enabledRef.current || !focusedRef.current) return;
      if (isArmenian) {
        const clip = hyClips[id];
        if (clip === undefined) throw new Error(`Missing Armenian audio for label ${id}`);
        player.replace(clip);
        player.play();
      } else {
        Speech.speak(text, {
          language: language === 'ru' ? 'ru-RU' : 'en-US',
          rate: 0.9,
          onError: error => {
            if (request === requestRef.current) lastSpokenRef.current = '';
            console.warn('Could not speak recognition:', error);
          },
        });
      }
    } catch (error) {
      if (request === requestRef.current) lastSpokenRef.current = '';
      console.warn('Could not play recognition audio:', error);
    }
  }, [language, player]);

  return { speak, stop };
}
