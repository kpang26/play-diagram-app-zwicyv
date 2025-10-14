
import React from "react";
import { Stack, Link } from "expo-router";
import { ScrollView, Pressable, StyleSheet, View, Text, Platform } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import AmericanFootballIcon from "@/components/AmericanFootballIcon";

export default function HomeScreen() {
  const renderHeaderRight = () => (
    <Pressable
      onPress={() => console.log("Settings pressed")}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="gear" color={colors.primary} />
    </Pressable>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Football Play Converter",
            headerRight: renderHeaderRight,
          }}
        />
      )}
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <AmericanFootballIcon size={100} color="#FFFFFF" backgroundColor={colors.primary} />
            <Text style={styles.title}>Football Play Converter</Text>
            <Text style={styles.subtitle}>
              Transform hand-drawn plays into professional diagrams
            </Text>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.featureCard}>
              <IconSymbol name="camera.fill" size={32} color={colors.secondary} />
              <Text style={styles.featureTitle}>Upload or Capture</Text>
              <Text style={styles.featureDescription}>
                Take a photo or upload an image of your hand-drawn play
              </Text>
            </View>

            <View style={styles.featureCard}>
              <IconSymbol name="wand.and.stars" size={32} color={colors.accent} />
              <Text style={styles.featureTitle}>Auto Convert</Text>
              <Text style={styles.featureDescription}>
                AI-powered conversion to professional diagrams
              </Text>
            </View>

            <View style={styles.featureCard}>
              <IconSymbol name="square.and.arrow.up.fill" size={32} color={colors.primary} />
              <Text style={styles.featureTitle}>Share & Export</Text>
              <Text style={styles.featureDescription}>
                Download as PDF or share with your team
              </Text>
            </View>
          </View>

          <Link href="/play-converter" asChild>
            <Pressable style={styles.startButton}>
              <Text style={styles.startButtonText}>Get Started</Text>
              <IconSymbol name="arrow.right" size={20} color="#ffffff" />
            </Pressable>
          </Link>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>How It Works</Text>
            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Upload a photo of your hand-drawn play</Text>
            </View>
            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>Review the converted professional diagram</Text>
            </View>
            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>Download or share with your team</Text>
            </View>
          </View>
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
    paddingBottom: Platform.OS === 'ios' ? 20 : 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    boxShadow: '0px 4px 12px rgba(41, 98, 255, 0.3)',
    elevation: 4,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginRight: 8,
  },
  headerButtonContainer: {
    padding: 6,
  },
  infoSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    lineHeight: 20,
  },
});
