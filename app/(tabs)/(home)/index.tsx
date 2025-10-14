
import React from "react";
import { ScrollView, Pressable, StyleSheet, View, Text, Platform, Image } from "react-native";
import { Stack, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { supabaseConfig } from "@/config/supabase";

export default function HomeScreen() {
  const renderHeaderRight = () => (
    <Link href="/formsheet" asChild>
      <Pressable style={{ marginRight: 16 }}>
        <IconSymbol name="info.circle" size={24} color={colors.primary} />
      </Pressable>
    </Link>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Football Play Converter",
          headerRight: renderHeaderRight,
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroSection}>
            <View style={styles.iconContainer}>
              <IconSymbol name="sportscourt.fill" size={80} color={colors.primary} />
            </View>
            <Text style={styles.heroTitle}>Convert Hand-Drawn Plays</Text>
            <Text style={styles.heroSubtitle}>
              Transform your sketches into professional football diagrams using AI
            </Text>
          </View>

          <Link href="/play-converter" asChild>
            <Pressable style={styles.primaryButton}>
              <IconSymbol name="wand.and.stars" size={24} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Start Converting</Text>
            </Pressable>
          </Link>

          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Features</Text>
            
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <IconSymbol name="camera.fill" size={32} color={colors.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Easy Upload</Text>
                <Text style={styles.featureDescription}>
                  Take a photo or upload from your gallery
                </Text>
              </View>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <IconSymbol name="cpu" size={32} color={colors.secondary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>AI-Powered</Text>
                <Text style={styles.featureDescription}>
                  Advanced AI analyzes and converts your plays
                </Text>
              </View>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <IconSymbol name="arrow.down.doc.fill" size={32} color={colors.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Download & Share</Text>
                <Text style={styles.featureDescription}>
                  Export as PDF or share with your team
                </Text>
              </View>
            </View>
          </View>

          {!supabaseConfig.isConfigured() && (
            <View style={styles.setupCard}>
              <IconSymbol name="exclamationmark.triangle.fill" size={24} color="#FF9500" />
              <View style={styles.setupContent}>
                <Text style={styles.setupTitle}>Setup Required</Text>
                <Text style={styles.setupDescription}>
                  To enable full AI conversion, you need to:
                </Text>
                <View style={styles.setupSteps}>
                  <Text style={styles.setupStep}>• Connect to Supabase</Text>
                  <Text style={styles.setupStep}>• Deploy the edge function</Text>
                  <Text style={styles.setupStep}>• Add your OpenAI API key</Text>
                </View>
                <Text style={styles.setupNote}>
                  See AI_SETUP_GUIDE.md for detailed instructions
                </Text>
              </View>
            </View>
          )}

          {supabaseConfig.isConfigured() && (
            <View style={styles.statusCard}>
              <IconSymbol name="checkmark.circle.fill" size={24} color={colors.secondary} />
              <View style={styles.statusContent}>
                <Text style={styles.statusTitle}>Supabase Connected</Text>
                <Text style={styles.statusDescription}>
                  Your app is ready to use AI conversion. Make sure the edge function is deployed!
                </Text>
              </View>
            </View>
          )}

          <View style={styles.howItWorksSection}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            
            <View style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Upload Your Drawing</Text>
                <Text style={styles.stepDescription}>
                  Take a photo of your hand-drawn football play
                </Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>AI Analysis</Text>
                <Text style={styles.stepDescription}>
                  Our AI identifies players, routes, and formations
                </Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Get Professional Diagram</Text>
                <Text style={styles.stepDescription}>
                  Download or share your converted play diagram
                </Text>
              </View>
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
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  primaryButton: {
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
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 8,
  },
  featuresSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  featureCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  setupCard: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#FFE69C',
  },
  setupContent: {
    flex: 1,
    marginLeft: 12,
  },
  setupTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#856404',
    marginBottom: 8,
  },
  setupDescription: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 8,
  },
  setupSteps: {
    marginBottom: 8,
  },
  setupStep: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 4,
  },
  setupNote: {
    fontSize: 12,
    color: '#856404',
    fontStyle: 'italic',
  },
  statusCard: {
    backgroundColor: '#D4EDDA',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#C3E6CB',
  },
  statusContent: {
    flex: 1,
    marginLeft: 12,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#155724',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
    color: '#155724',
    lineHeight: 20,
  },
  howItWorksSection: {
    marginBottom: 32,
  },
  stepCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
