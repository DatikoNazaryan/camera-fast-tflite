# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

### Armenian audio

Armenian recognition labels play bundled Azure Anahit MP3s from `assets/tts/hy`.
The app needs neither Azure credentials nor an internet connection for these clips.
English and Russian continue to use device text-to-speech.

After installing dependencies, rebuild the native development app (`npm run ios`
or `npm run android`) to include `expo-audio`; an existing development binary
without this native module cannot load the updated screen.

To regenerate the pack, set `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION` in the
Git-ignored `.env.tts.local`, then run `npm run tts:generate:hy`.
Existing clips are skipped; after editing label text, pass `-- --force` to
regenerate them. Commit the MP3s and generated `src/services/tts/hyClips.ts`
together. Voice auditions run with `npm run tts:audition -- --generate` and are
stored separately under `artifacts/tts-audition`.

On a rebuilt physical iPhone and Android device, check recognition in airplane
mode, repeat a label after restarting scanning, mute, navigate away during
playback, and check iPhone silent-mode playback and Bluetooth routing.

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
