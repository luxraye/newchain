import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export function StatCard({
  label,
  value,
  accentColor,
  icon,
}: {
  label: string;
  value: string;
  accentColor?: string;
  icon?: keyof typeof Feather.glyphMap;
}) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      {icon ? (
        <Feather
          name={icon}
          size={16}
          color={accentColor ?? colors.accent}
          style={styles.statIcon}
        />
      ) : null}
      <Text
        style={[styles.statValue, { color: accentColor ?? colors.foreground }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
    </View>
  );
}

export function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
  variant = 'primary',
  testID,
  style,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
  testID?: string;
  style?: ViewStyle;
}) {
  const colors = useColors();
  const isDisabled = !!disabled || !!loading;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(
          () => {},
        );
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        {
          borderRadius: colors.radius,
          backgroundColor:
            variant === 'primary' ? colors.primary : 'transparent',
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: colors.border,
          opacity: isDisabled ? 0.5 : pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'primary' ? colors.primaryForeground : colors.accent
          }
        />
      ) : (
        <Text
          style={[
            styles.buttonText,
            {
              color:
                variant === 'primary'
                  ? colors.primaryForeground
                  : colors.foreground,
            },
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.centerBox}>
      <Feather name="alert-triangle" size={28} color={colors.destructive} />
      <Text style={[styles.centerText, { color: colors.mutedForeground }]}>
        {message}
      </Text>
      {onRetry ? (
        <PrimaryButton
          title="Retry"
          variant="outline"
          onPress={onRetry}
          testID="retry-button"
          style={styles.retryButton}
        />
      ) : null}
    </View>
  );
}

export function LoadingState() {
  const colors = useColors();
  return (
    <View style={styles.centerBox}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  statCard: {
    flexGrow: 1,
    flexBasis: '45%',
    borderWidth: 1,
    padding: 16,
    gap: 4,
  },
  statIcon: {
    marginBottom: 4,
  },
  statValue: {
    fontSize: 26,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  button: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 32,
  },
  centerText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  retryButton: {
    alignSelf: 'stretch',
    marginTop: 8,
  },
});
