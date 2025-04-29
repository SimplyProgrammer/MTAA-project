# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

0. Install node.js (reasonably new 20+)

1. Create .env file with
```
EXPO_PUBLIC_API_URL=<IP:Port/ or URL/ of BE> For example 192.168.0.1:5000
```

2. Install dependencies

   ```bash
   npm i
   ```

3. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
TLDR: Emulator:
1. Install Android Studio
	- Select custom install and check all checkboxes
2. Create virtual device - With API 33+ and google playstore preinstalled.
3. Launch the ANdroid device
4. npx expo start --clear 
5. Press a and than j...

6. O use Expo Go app if u have android but this is iffy...

TLDR build:
1. Add this system env variable:
Variable name: ANDROID_HOME
Variable value: C:\Users\<your-username>\AppData\Local\Android\Sdk
2. Add to "Path" variable
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project
WAS ALREADY DONE, DO NOT!

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
