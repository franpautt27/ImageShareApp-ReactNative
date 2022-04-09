import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import uploadToAnonymousFilesAsync from 'anonymous-files'

import React, { useState, useEffect } from "react";

import * as ImagePicker from "expo-image-picker";

import * as Sharing from "expo-sharing";

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera is required");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.canceled === true) {
      return;
    }
    if(Platform.OS === "web"){
      const remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri)
      setSelectedImage({localUri: pickerResult.uri, remoteUri});
    }else{
      setSelectedImage({ localUri: pickerResult.uri });

    }
  };

  const openShareDialog = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert("Sharing is not available on your device");
      return;
    }
    await Sharing.shareAsync(selectedImage.localUri);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pick an Image!</Text>
      <TouchableOpacity onPress={openImagePickerAsync}>
        <Image
          style={styles.image}
          source={{
            uri:
              selectedImage !== null
                ? selectedImage.localUri
                : "https://picsum.photos/200/200",
          }}
        />
      </TouchableOpacity>

      {selectedImage && (
        <TouchableOpacity onPress={openShareDialog} style={styles.button}>
          <Text style={styles.buttonText}>Share this image</Text>
        </TouchableOpacity>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
  },
  text: { color: "white", fontSize: 30 },
  image: { width: 200, height: 200, borderRadius: 100, resizeMode: "contain" },
  button: { backgroundColor: "blue", padding: 7, marginTop: 10 },
  buttonText: { color: "white", fontSize: 20 },
});
