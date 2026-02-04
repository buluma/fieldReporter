# Deployment Guide

This guide provides instructions for deploying the Field Reporter application to various mobile platforms using Apache Cordova.

## 1. Prerequisites

Before deployment, ensure you have the following installed and configured:

-   **Node.js**: Version 12 or higher.
-   **Apache Cordova CLI**: Installed globally (`npm install -g cordova`).
-   **Platform SDKs**:
    -   **Android**: Android Studio with necessary SDK platforms and build tools.
    -   **iOS**: Xcode with Command Line Tools.
-   **Code Signing Assets**:
    -   **Android**: Keystore file for signing your APK/AAB.
    -   **iOS**: Apple Developer account, signing certificates, and provisioning profiles.

## 2. Project Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/fieldReporter.git
    cd fieldReporter
    ```
2.  **Install project dependencies**:
    ```bash
    npm install
    ```
3.  **Add target platforms**:
    ```bash
    cordova platform add android
    cordova platform add ios
    ```

## 3. Building for Production

### 3.1. General Build Commands

-   **Build for Android**:
    ```bash
    cordova build android --release
    ```
-   **Build for iOS**:
    ```bash
    cordova build ios --release
    ```
-   **Build for all added platforms**:
    ```bash
    cordova build --release
    ```

### 3.2. Android-Specific Steps

1.  **Generate a Keystore (if you don't have one)**:
    ```bash
    keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
    ```
2.  **Sign the APK/AAB**:
    -   Place your `.keystore` file in the project's root directory or a secure location.
    -   Create a `build.json` file in your project root:
        ```json
        {
            "android": {
                "release": {
                    "keystore": "my-release-key.keystore",
                    "storePassword": "your_store_password",
                    "alias": "alias_name",
                    "password": "your_key_password",
                    "packageType": "bundle" // or "apk"
                }
            }
        }
        ```
    -   Build with signing:
        ```bash
        cordova build android --release --buildConfig=build.json
        ```
    -   The signed AAB/APK will be located in `platforms/android/app/build/outputs/[aab|apk]/release/`.
3.  **Optimize the APK/AAB (optional but recommended)**: Use `zipalign` (part of Android SDK Build Tools).
    ```bash
    zipalign -v 4 your_app-release-unsigned.apk your_app-release-aligned.apk
    ```
    (Note: `cordova build --release` usually handles this for AABs.)

### 3.3. iOS-Specific Steps

1.  **Configure Code Signing in Xcode**:
    -   Open the `.xcodeproj` file located in `platforms/ios/` in Xcode.
    -   In Xcode, select your project in the Project Navigator.
    -   Go to the "Signing & Capabilities" tab for your target.
    -   Ensure your Apple Developer account is configured, and select the correct Team, Signing Certificate, and Provisioning Profile.
2.  **Build from Xcode (recommended for iOS release)**:
    -   In Xcode, select `Product > Archive`.
    -   Once archiving is complete, use the "Distribute App" option to upload to App Store Connect or export for Ad Hoc distribution.
3.  **Alternatively, build from CLI with signing properties (less common for iOS release)**:
    -   Create a `build.json` similar to Android, specifying `codeSignIdentity` and `provisioningProfile`.
    -   Run `cordova build ios --release --buildConfig=build.json`.

## 4. Deploying to App Stores

### 4.1. Google Play Store (Android)

1.  Go to the [Google Play Console](https://play.google.com/console).
2.  Create a new application.
3.  Upload your signed `.aab` (Android App Bundle) file.
4.  Fill in all required store listing details, content ratings, pricing, and distribution information.
5.  Publish your app.

### 4.2. Apple App Store (iOS)

1.  Go to [App Store Connect](https://appstoreconnect.apple.com).
2.  Create a new app entry.
3.  Use Xcode (via `Product > Archive` and "Distribute App") to upload your app binary to App Store Connect.
4.  Fill in all required app information, pricing, and distribution details.
5.  Submit your app for review.

## 5. Continuous Integration/Continuous Deployment (CI/CD)

For automated builds and deployments, consider integrating with CI/CD platforms like:

-   **Jenkins**
-   **GitLab CI/CD**
-   **GitHub Actions**
-   **AppCenter** (Microsoft Visual Studio App Center)
-   **Bitrise**

These platforms can automate the building, signing, testing, and distribution processes.

## 6. Rollback Strategy

In case of critical issues with a new release:
1.  **App Store Rollback**: Utilize the app store's (Google Play Console, App Store Connect) built-in features to unpublish the problematic version or revert to a previous stable version.
2.  **Version Control**: Ensure all release builds are tagged in your Git repository, allowing for quick rollback to previous code states.
3.  **IndexedDB Schema**: Be mindful of IndexedDB schema changes. Major breaking changes might require a more complex migration or a clear upgrade/downgrade path in your `onupgradeneeded` logic.
