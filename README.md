# Calci — mobile (Android & iOS)

Native mobile app for **Calci**, the all-in-one advanced calculator. It wraps the Calci web app
([CALCI-W](https://github.com/flamekaizen/CALCI-W)) with [Capacitor](https://capacitorjs.com) and adds
native haptics, status-bar theming, splash screen, keyboard handling and the Android back button.
Everything works offline; only the optional Python runtime and the API explorer need a connection.

## Install on your Android phone

1. Open the repository’s **Releases** page on your phone and download the latest `Calci-v*.apk` (or download it on a computer and copy it to the phone).
2. Tap the file. Android asks to allow installing from this source (your browser or file manager) — allow it once.
3. Tap **Install**, then open Calci.

Every push to `main` also builds an APK you can download from the **Actions** tab (artifact `calci-apk`).

## Layout

```
www/                       Web bundle (built from CALCI-W with `npm run build:native`, committed so this repo builds on its own)
android/                   Native Android project (Gradle)
ios/                       Native iOS project (Xcode, Swift Package Manager — no CocoaPods needed)
capacitor.config.json
scripts/sync-web.mjs       Rebuild the web bundle from ../CALCI-W and copy it to www/
scripts/android-icons.mjs  Regenerate launcher icons and splash screens
```

## Build

Requirements: Node 20+, Android Studio (with SDK 36) for Android, Xcode 16+ on macOS for iOS.

```bash
npm install
npx cap sync                 # copy www/ into the native projects
npm run build:android        # → android/app/build/outputs/apk/debug/app-debug.apk
npm run open:android         # or open in Android Studio
npm run open:ios             # open in Xcode (macOS)
```

Update the web bundle after changing CALCI-W (expects it next to this folder, or set `CALCI_WEB_DIR`):

```bash
npm run sync                 # build CALCI-W for native, copy to www/, cap sync
```

## Release

- **Android (Play Store):** create an upload keystore, add a `signingConfigs.release` block in
  `android/app/build.gradle` (keep the keystore and passwords out of git), then `npm run build:android:release`
  to produce `app-release.aab`.
- **iOS (App Store):** open `ios/App/App.xcodeproj`, select your team under *Signing & Capabilities*, then
  *Product → Archive*.

App id: `io.github.flamekaizen.calci`. Icons and splash screens are generated from the original Calci mark.

## CI

`.github/workflows/android.yml` builds a debug APK on every push to `main` and uploads it as an artifact.

## Licence

MIT © flamekaizen. Third-party notices ship inside the app (`www/licenses.txt`).
