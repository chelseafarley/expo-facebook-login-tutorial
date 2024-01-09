import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, View } from "react-native";
import { useEffect } from "react";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginButton,
  Settings,
  ShareDialog,
} from "react-native-fbsdk-next";

export default function App() {
  useEffect(() => {
    const requestTracking = async () => {
      const { status } = await requestTrackingPermissionsAsync();

      Settings.initializeSDK();

      if (status === "granted") {
        await Settings.setAdvertiserTrackingEnabled(true);
      }
    };

    requestTracking();
  }, []);

  const getData = () => {
    const infoRequest = new GraphRequest("/me", null, (error, result) => {
      console.log(error || result);
    });
    new GraphRequestManager().addRequest(infoRequest).start();
  };

  const shareLink = async () => {
    const content = {
      contentType: "link",
      contentUrl: "https://www.youtube.com/channel/UCwJWXcI12lhcorzG7Vrf2zw",
    };

    const canShow = await ShareDialog.canShow(content);

    if (canShow) {
      try {
        const { isCancelled, postId } = await ShareDialog.show(content);

        if (isCancelled) {
          console.log("Share cancelled");
        } else {
          console.log("Share success with postId: " + postId);
        }
      } catch (e) {
        console.log("Share fail with error: " + e);
      }
    }
  };

  return (
    <View style={styles.container}>
      <LoginButton
        onLogoutFinished={() => console.log("Logged out")}
        onLoginFinished={(error, data) => {
          console.log(error || data);
          AccessToken.getCurrentAccessToken().then((data) => console.log(data));
        }}
      />
      <Button title="Get Data" onPress={getData} />
      <Button title="Share Link" onPress={shareLink} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

/*
  npx create-expo-app expo-facebook-login-tutorial
  For testing we need a standalone app which is why we install expo-dev-client

  npx expo install expo-dev-client
  
  If you don't have eas installed then install using the following command:
  npm install -g eas-cli

  eas login
  eas build:configure

  Update app.json with package and bundle identifiers.
  
  Setup Android build credentials using the following command. 
  This will allow you to configure your Facebook app. 
  You'll need to do this again for prod when you are ready to release.

  eas credentials

  Go to https://developers.facebook.com/apps/creation/
  Authenticate with FB option
  Answer the on screen questions
  Click Customize Facebook Login Button
  
  Go to quick start
  Select Android, you can skip most of the steps as we are not building natively
  Convert SHA1 from eas credentials to Base64: https://base64.guru/converter/encode/hex
  Copy value into Add Your Development and Release Key Hashes
  
  Go back to quick start
  Select iOS, you can skip most of the steps
  Enter bundle identifier and save

  Go to App Settings > Basic Settings
  Verify your iOS and Android App settings have saved

  Install react-native-fbsdk-next
  npx expo install react-native-fbsdk-next

  Install expo-tracking-transparency
  npx expo install expo-tracking-transparency

  To the app.json, add the necessary config to the plugins section
  The appID and clientToken can come from the Facebook Basic Setting's page

  Build for iOS or Android:
  eas build -p ios --profile development
  OR
  eas build -p android --profile development

  After building install on your device:
  For iOS (simulator): https://docs.expo.dev/build-reference/simulators/
  For Android: https://docs.expo.dev/build-reference/apk/

  Run on installed app:
  expo start --dev-client
*/
