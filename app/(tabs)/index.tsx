// import { Image } from 'expo-image';
// import { Button, Platform, StyleSheet } from 'react-native';

// import { HelloWave } from '@/components/hello-wave';
// import ParallaxScrollView from '@/components/parallax-scroll-view';
// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { Link } from 'expo-router';

// export default function HomeScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/partial-react-logo.png')}
//           style={styles.reactLogo}
//         />
//       }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title" style={{backgroundColor:'blue'}}>Welcome Krish Ab Machega BhauKaal App Development me bhi 🎉!</ThemedText>
//         <Button title='Hii' onPress={() => console.log("Hii")}/>
//         <HelloWave />
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
//         <ThemedText>
//           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
//           Press{' '}
//           <ThemedText type="defaultSemiBold">
//             {Platform.select({
//               ios: 'cmd + d',
//               android: 'cmd + m',
//               web: 'F12',
//             })}
//           </ThemedText>{' '}
//           to open developer tools.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <Link href="/modal">
//           <Link.Trigger>
//             <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//           </Link.Trigger>
//           <Link.Preview />
//           <Link.Menu>
//             <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
//             <Link.MenuAction
//               title="Share"
//               icon="square.and.arrow.up"
//               onPress={() => alert('Share pressed')}
//             />
//             <Link.Menu title="More" icon="ellipsis">
//               <Link.MenuAction
//                 title="Delete"
//                 icon="trash"
//                 destructive
//                 onPress={() => alert('Delete pressed')}
//               />
//             </Link.Menu>
//           </Link.Menu>
//         </Link>

//         <ThemedText>
//           {`Tap the Explore tab to learn more about what's included in this starter app.`}
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//         <ThemedText>
//           {`When you're ready, run `}
//           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
//           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
//         </ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });
















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

