import React from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DemoPanel } from '@/components/DemoPanel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useDonor } from '@/lib/donor-context';
import {
  ErrorState,
  LoadingState,
  PrimaryButton,
  StatCard,
} from '@/components/pulse-ui';
import { Feather } from '@expo/vector-icons';
import { useGetNationalStats } from '@workspace/api-client-react';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { donorId } = useDonor();
  const { data, isLoading, isError, refetch, isRefetching } =
    useGetNationalStats();

  const topInset = Platform.OS === 'web' ? 67 : insets.top;

  if (isLoading) return <LoadingState />;

  const inventory = data?.inventoryByBloodType ?? {};
  const bloodTypes = Object.keys(inventory);

  return (
    <View style={{ flex: 1 }}>
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topInset + 16, paddingBottom: 120 },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={() => refetch()}
          tintColor={colors.accent}
        />
      }
    >
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Feather name="activity" size={22} color={colors.primary} />
          <Text style={[styles.brand, { color: colors.foreground }]}>
            Pulse
          </Text>
        </View>
        <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
          Botswana&apos;s national blood grid
        </Text>
      </View>

      {isError ? (
        <ErrorState
          message="Couldn't load national stats."
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <View style={styles.statsGrid}>
            <StatCard
              label="Units in stock"
              value={String(data?.totalUnitsInStock ?? 0)}
              accentColor={colors.accent}
              icon="database"
            />
            <StatCard
              label="Collected today"
              value={String(data?.unitsCollectedToday ?? 0)}
              accentColor={colors.primary}
              icon="droplet"
            />
            <StatCard
              label="Facilities online"
              value={String(data?.facilitiesOnline ?? 0)}
              icon="home"
            />
            <StatCard
              label="Active alerts"
              value={String(data?.activeAlerts ?? 0)}
              accentColor={
                (data?.activeAlerts ?? 0) > 0
                  ? colors.destructive
                  : colors.foreground
              }
              icon="alert-circle"
            />
          </View>

          {bloodTypes.length > 0 ? (
            <View
              style={[
                styles.inventoryCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: colors.radius,
                },
              ]}
            >
              <Text
                style={[styles.sectionTitle, { color: colors.foreground }]}
              >
                National inventory
              </Text>
              {bloodTypes.map((type) => {
                const units = inventory[type] ?? 0;
                const max = Math.max(
                  ...bloodTypes.map((t) => inventory[t] ?? 0),
                  1,
                );
                return (
                  <View key={type} style={styles.invRow}>
                    <Text
                      style={[styles.invType, { color: colors.foreground }]}
                    >
                      {type}
                    </Text>
                    <View
                      style={[
                        styles.invTrack,
                        { backgroundColor: colors.secondary },
                      ]}
                    >
                      <View
                        style={[
                          styles.invFill,
                          {
                            backgroundColor:
                              units / max < 0.3
                                ? colors.destructive
                                : colors.accent,
                            width: `${Math.max((units / max) * 100, 4)}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text
                      style={[
                        styles.invUnits,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {units}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : null}

          <PrimaryButton
            title={donorId ? 'View my donor card' : 'Become a donor'}
            testID="home-cta"
            onPress={() =>
              router.push(donorId ? '/(tabs)/dashboard' : '/(tabs)/register')
            }
          />
        </>
      )}
    </ScrollView>
    <DemoPanel />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    gap: 20,
  },
  header: {
    gap: 4,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brand: {
    fontSize: 28,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  tagline: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  inventoryCard: {
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk_600SemiBold',
    marginBottom: 4,
  },
  invRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  invType: {
    width: 36,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  invTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  invFill: {
    height: 8,
    borderRadius: 4,
  },
  invUnits: {
    width: 32,
    textAlign: 'right',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
});
