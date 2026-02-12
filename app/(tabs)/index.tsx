import { useRef, useState, useEffect } from "react";
import { View, ActivityIndicator, Alert, BackHandler, StyleSheet, Button, Text } from "react-native";
import { WebView } from "react-native-webview";

export default function HomeScreen() {
  const webviewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);

  // ===== Back Button Handling =====
  useEffect(() => {
    const onBackPress = () => {
      if (canGoBack && webviewRef.current) {
        webviewRef.current.goBack();
        return true; // handled
      }
      return false; // exit app
    };

    const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => subscription.remove();
  }, [canGoBack]);

  // ===== Handle Messages from Web =====
  const handleMessage = (event: any) => {
    if (event.nativeEvent.data === "sync") {
      console.log('even ', event.nativeEvent.data)
      Alert.alert(
        "Sync Device",
        "Do you want to sync?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes",
            onPress: () => {
              // Send dummy JSON back to web
              webviewRef.current?.injectJavaScript(`
                window.dispatchEvent(new MessageEvent('message', {
                  data: JSON.stringify({ deviceId: "BENTO-99", status: "Synced" })
                }));
                true;
                `);
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Loading Spinner */}
      {loading && (
        <ActivityIndicator
          style={styles.spinner}
          size="large"
          color="#2563eb"
        />
      )}

      {/* Webview */}

      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ uri: "https://6cj6sjrh-5173.inc1.devtunnels.ms/" }} // replace with your web app URL
        onLoadEnd={() => setLoading(false)}
        onMessage={handleMessage}
        userAgent="BentoShell/1.0"
        injectedJavaScript={`document.documentElement.style.setProperty('--bento-safe-top', '40px');`}
        onNavigationStateChange={navState => setCanGoBack(navState.canGoBack)}
        renderError={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, marginBottom: 16 }}>Oops! Something went wrong.</Text>
            <Button title="Try Again" onPress={() => webviewRef.current?.reload()} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  spinner: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});

