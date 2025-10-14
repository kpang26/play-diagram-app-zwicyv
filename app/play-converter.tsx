
import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Image, 
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform
} from "react-native";
import { Stack, router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { cacheDirectory } from "expo-file-system";
import { captureRef } from "react-native-view-shot";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabaseConfig } from "@/config/supabase";

export default function PlayConverterScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState<string>('');
  const diagramRef = React.useRef<View>(null);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant camera roll permissions to upload images.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setConvertedImage(null);
        console.log('Image selected:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant camera permissions to take photos.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setConvertedImage(null);
        console.log('Photo taken:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const convertPlay = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select or capture an image first.');
      return;
    }

    // Check if Supabase is configured
    if (!supabaseConfig.isConfigured()) {
      setIsConverting(true);
      setConversionProgress('Demo mode - simulating conversion...');
      
      // Simulate AI processing in demo mode
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setConvertedImage(selectedImage);
      setIsConverting(false);
      setConversionProgress('');
      
      Alert.alert(
        'Demo Mode',
        'To enable full AI conversion:\n\n' +
        '1. Press the Supabase button to connect your project\n' +
        '2. Deploy the convert-football-play edge function\n' +
        '3. Add your OpenAI API key to Supabase secrets\n' +
        '4. Add Supabase credentials to your .env file\n\n' +
        'See AI_SETUP_GUIDE.md for detailed instructions.\n\n' +
        'For now, showing your original image as a placeholder.'
      );
      return;
    }

    setIsConverting(true);
    setConversionProgress('Preparing image...');
    console.log('Starting AI conversion...');

    try {
      // Step 1: Read the image file and convert to base64
      setConversionProgress('Reading image data...');
      const base64Image = await FileSystem.readAsStringAsync(selectedImage, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log('Image converted to base64');

      // Step 2: Call the Supabase Edge Function
      setConversionProgress('Analyzing play with AI...');
      
      const response = await fetch(
        supabaseConfig.getEdgeFunctionUrl('convert-football-play'),
        {
          method: 'POST',
          headers: supabaseConfig.getHeaders(),
          body: JSON.stringify({
            image: base64Image,
            prompt: 'Convert this hand-drawn football play into a professional diagram with clear player positions, routes, and formations. Use standard football notation and symbols.',
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        
        if (errorData.error === 'OpenAI API key not configured') {
          throw new Error(
            'OpenAI API key not configured in Supabase. Please add OPENAI_API_KEY to your Supabase secrets. See AI_SETUP_GUIDE.md for instructions.'
          );
        }
        
        throw new Error(errorData.error || 'Failed to convert play');
      }

      const data = await response.json();
      console.log('Conversion successful');

      // Step 3: Save the converted image
      setConversionProgress('Finalizing diagram...');
      
      if (data.url) {
        // If the API returns a URL, use it directly
        setConvertedImage(data.url);
      } else if (data.image) {
        // If the API returns base64, save it locally
        const fileName = `converted-play-${Date.now()}.png`;
        const fileUri = `${cacheDirectory}${fileName}`;
        
        await FileSystem.writeAsStringAsync(fileUri, data.image, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        setConvertedImage(fileUri);
      } else {
        throw new Error('No image data received from API');
      }

      setIsConverting(false);
      setConversionProgress('');
      
      Alert.alert(
        'Conversion Complete!',
        'Your hand-drawn play has been converted to a professional diagram using AI.'
      );
    } catch (error: any) {
      console.error('Conversion error:', error);
      setIsConverting(false);
      setConversionProgress('');
      
      Alert.alert(
        'Conversion Failed',
        error.message || 'Failed to convert play. Please check your connection and try again.'
      );
    }
  };

  const downloadPDF = async () => {
    if (!convertedImage || !diagramRef.current) {
      Alert.alert('No Diagram', 'Please convert a play first.');
      return;
    }

    try {
      console.log('Capturing diagram...');
      const uri = await captureRef(diagramRef, {
        format: 'png',
        quality: 1,
      });

      console.log('Diagram captured:', uri);

      const fileName = `football-play-${Date.now()}.png`;
      const fileUri = `${cacheDirectory}${fileName}`;

      await FileSystem.copyAsync({
        from: uri,
        to: fileUri,
      });

      console.log('File saved:', fileUri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'image/png',
          dialogTitle: 'Share Football Play',
        });
      } else {
        Alert.alert(
          'Success',
          'Diagram saved successfully!'
        );
      }
    } catch (error) {
      console.error('Error saving diagram:', error);
      Alert.alert('Error', 'Failed to save diagram. Please try again.');
    }
  };

  const sharePlay = async () => {
    if (!convertedImage) {
      Alert.alert('No Diagram', 'Please convert a play first.');
      return;
    }

    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(convertedImage, {
          mimeType: 'image/png',
          dialogTitle: 'Share Football Play',
        });
        console.log('Sharing initiated');
      } else {
        Alert.alert('Sharing Not Available', 'Sharing is not available on this device.');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share. Please try again.');
    }
  };

  const resetConverter = () => {
    setSelectedImage(null);
    setConvertedImage(null);
    setIsConverting(false);
    setConversionProgress('');
    console.log('Converter reset');
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Convert Play",
          headerBackTitle: "Back",
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {!selectedImage ? (
            <View style={styles.uploadSection}>
              <IconSymbol name="photo.on.rectangle" size={80} color={colors.textSecondary} />
              <Text style={styles.uploadTitle}>Upload Your Play</Text>
              <Text style={styles.uploadSubtitle}>
                Take a photo or choose from your gallery
              </Text>

              <View style={styles.buttonGroup}>
                <Pressable style={styles.uploadButton} onPress={takePhoto}>
                  <IconSymbol name="camera.fill" size={24} color="#ffffff" />
                  <Text style={styles.uploadButtonText}>Take Photo</Text>
                </Pressable>

                <Pressable style={[styles.uploadButton, styles.secondaryButton]} onPress={pickImage}>
                  <IconSymbol name="photo.fill" size={24} color={colors.primary} />
                  <Text style={[styles.uploadButtonText, styles.secondaryButtonText]}>
                    Choose from Gallery
                  </Text>
                </Pressable>
              </View>

              <View style={styles.setupInfoBox}>
                <IconSymbol name="info.circle.fill" size={20} color={colors.primary} />
                <View style={styles.setupInfoContent}>
                  <Text style={styles.setupInfoText}>
                    <Text style={styles.setupInfoBold}>AI Setup Required:{'\n'}</Text>
                    {supabaseConfig.isConfigured() 
                      ? 'Supabase connected! Make sure the edge function is deployed with your OpenAI API key.'
                      : 'To enable AI conversion, connect your Supabase project and configure the edge function. See AI_SETUP_GUIDE.md for instructions.'
                    }
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.previewSection}>
              <View style={styles.imageContainer}>
                <Text style={styles.sectionTitle}>Original Drawing</Text>
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              </View>

              {!convertedImage && !isConverting && (
                <View style={styles.actionButtons}>
                  <Pressable style={styles.convertButton} onPress={convertPlay}>
                    <IconSymbol name="wand.and.stars" size={24} color="#ffffff" />
                    <Text style={styles.convertButtonText}>
                      {supabaseConfig.isConfigured() ? 'Convert with AI' : 'Try Demo Mode'}
                    </Text>
                  </Pressable>

                  <Pressable style={styles.resetButton} onPress={resetConverter}>
                    <Text style={styles.resetButtonText}>Choose Different Image</Text>
                  </Pressable>
                </View>
              )}

              {isConverting && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={styles.loadingText}>{conversionProgress}</Text>
                  <Text style={styles.loadingSubtext}>
                    {supabaseConfig.isConfigured() 
                      ? 'AI is analyzing your hand-drawn play and creating a professional diagram'
                      : 'Running in demo mode - simulating AI conversion'
                    }
                  </Text>
                </View>
              )}

              {convertedImage && !isConverting && (
                <View style={styles.resultSection}>
                  <View style={styles.imageContainer} ref={diagramRef}>
                    <Text style={styles.sectionTitle}>Professional Diagram</Text>
                    <Image source={{ uri: convertedImage }} style={styles.previewImage} />
                    <View style={styles.watermark}>
                      <Text style={styles.watermarkText}>Football Play Converter</Text>
                    </View>
                  </View>

                  <View style={styles.actionButtons}>
                    <Pressable style={styles.downloadButton} onPress={downloadPDF}>
                      <IconSymbol name="arrow.down.doc.fill" size={24} color="#ffffff" />
                      <Text style={styles.downloadButtonText}>Download as PDF</Text>
                    </Pressable>

                    <Pressable style={styles.shareButton} onPress={sharePlay}>
                      <IconSymbol name="square.and.arrow.up.fill" size={24} color={colors.primary} />
                      <Text style={styles.shareButtonText}>Share</Text>
                    </Pressable>

                    <Pressable style={styles.resetButton} onPress={resetConverter}>
                      <Text style={styles.resetButtonText}>Convert Another Play</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 40,
  },
  uploadSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  uploadTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 20,
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(41, 98, 255, 0.3)',
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.primary,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: colors.primary,
  },
  setupInfoBox: {
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 32,
    width: '100%',
  },
  setupInfoContent: {
    flex: 1,
  },
  setupInfoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  setupInfoBold: {
    fontWeight: '700',
  },
  previewSection: {
    gap: 20,
  },
  imageContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  previewImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  watermark: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  watermarkText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  actionButtons: {
    gap: 12,
  },
  convertButton: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(76, 175, 80, 0.3)',
    elevation: 4,
  },
  convertButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 8,
  },
  downloadButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(41, 98, 255, 0.3)',
    elevation: 4,
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 8,
  },
  shareButton: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 8,
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  resultSection: {
    gap: 20,
  },
});
