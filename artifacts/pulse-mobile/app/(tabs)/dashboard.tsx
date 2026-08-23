import React, { useRef, useState } from 'react';
import {
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import {
  ErrorState,
  LoadingState,
  PrimaryButton,
  StatCard,
} from '@/components/pulse-ui';
import { useColors } from '@/hooks/useColors';
import { useDonor } from '@/lib/donor-context';
import { Feather } from '@expo/vector-icons';
import { useGetDonor, useGetUnits } from '@workspace/api-client-react';
import { useRouter } from 'expo-router';
import { downloadDonorCardPng } from '@/lib/donor-card-download';

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { donorId, isHydrated, clearDonor } = useDonor();
  const cardRef = useRef<ViewShot>(null);
  const [sharing, setSharing] = useState(false);

  const topInset = Platform.OS === 'web' ? 67 : insets.top;

  const donorQuery = useGetDonor(donorId ?? '', {
    query: {
      queryKey: [`/api/donors/${donorId ?? ''}`],
      enabled: !!donorId,
    },
  });
  const unitsQuery = useGetUnits({ donorId: donorId ?? undefined }, {
    query: {
      queryKey: ['/api/units', { donorId }],
      enabled: !!donorId,
    },
  });

  const handleShare = async () => {
    if (!donorQuery.data) return;
    const donor = donorQuery.data;

    if (Platform.OS === 'web') {
      setSharing(true);
      try {
        await downloadDonorCardPng({
          name: donor.name,
          donorId: donor.donorId ?? donorId ?? 'donor',
          bloodType: donor.bloodType,
          district: donor.district,
          nextEligibleDate: donor.nextEligibleDate,
          status: donor.status,
        });
        Alert.alert('Downloaded!', 'Your donor card was saved as a PNG image.');
      } catch {
        Alert.alert('Could not download', 'Please try again.');
      } finally {
        setSharing(false);
      }
      return;
    }

    // Native: capture card as image and share
    setSharing(true);
    try {
      const uri = await captureRef(cardRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share your Pulse Donor Card',
        });
      } else {
        // Fall back to RN Share text
        const donor = donorQuery.data;
        await Share.share({
          title: 'My Pulse Donor Card',
          message:
            `🩸 Pulse Donor Card\n` +
            `Name: ${donor.name ?? 'Donor'}\n` +
            `Blood type: ${donor.bloodType ?? '?'}\n` +
            `ID: ${donor.donorId} · ${donor.district}\n` +
            `Next eligible: ${formatDate(donor.nextEligibleDate)}`,
        });
      }
    } catch (err: unknown) {
      // user dismissed share sheet — ignore cancellations
      const message = err instanceof Error ? err.message : String(err);
      if (!message.includes('cancel') && !message.includes('dismiss')) {
        Alert.alert('Could not share', 'Please try again.');
      }
    } finally {
      setSharing(false);
    }
  };

  if (!isHydrated) return <LoadingState />;

  if (!donorId) {
    return (
      <View
        style={[
          styles.empty,
          { backgroundColor: colors.background, paddingTop: topInset + 60 },
        ]}
      >
        <Feather name="user-plus" size={40} color={colors.mutedForeground} />
        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
          No donor card yet
        </Text>
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
          Register as a donor to get your card, next donation date and airtime
          rewards.
        </Text>
        <PrimaryButton
          title="Register now"
          testID="empty-register"
          onPress={() => router.push('/(tabs)/register')}
          style={styles.emptyButton}
        />
      </View>
    );
  }

  if (donorQuery.isLoading) return <LoadingState />;

  if (donorQuery.isError || !donorQuery.data) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ErrorState
          message="Couldn't load your donor record. It may have been removed."
          onRetry={() => donorQuery.refetch()}
        />
        <PrimaryButton
          title="Start over"
          variant="outline"
          testID="clear-donor"
          onPress={clearDonor}
          style={styles.clearButton}
        />
      </View>
    );
  }

  const donor = donorQuery.data;
  const myUnits = unitsQuery.data?.units ?? [];

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topInset + 16, paddingBottom: 120 },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={donorQuery.isRefetching}
          onRefresh={() => {
            donorQuery.refetch();
            unitsQuery.refetch();
          }}
          tintColor={colors.accent}
        />
      }
    >
      {/* Card wrapped in ViewShot for image capture */}
      <ViewShot ref={cardRef} options={{ format: 'png', quality: 1 }}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.primary,
              borderRadius: colors.radius,
            },
          ]}
        >
          <View style={styles.cardTop}>
            <View style={styles.cardTitleWrap}>
              <Text style={[styles.cardBrand, { color: colors.primary }]}>
                PULSE DONOR
              </Text>
              <Text style={[styles.cardName, { color: colors.foreground }]}>
                {donor.name ?? 'Donor'}
              </Text>
              <Text style={[styles.cardMeta, { color: colors.mutedForeground }]}>
                {donor.donorId} · {donor.district}
              </Text>
            </View>
            <View
              style={[
                styles.bloodBadge,
                {
                  backgroundColor: colors.primary,
                  borderRadius: colors.radius,
                },
              ]}
            >
              <Text
                style={[styles.bloodBadgeText, { color: colors.primaryForeground }]}
              >
                {donor.bloodType ?? '?'}
              </Text>
            </View>
          </View>
          <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />
          <View style={styles.cardRow}>
            <Feather name="calendar" size={14} color={colors.accent} />
            <Text style={[styles.cardRowText, { color: colors.foreground }]}>
              Next eligible: {formatDate(donor.nextEligibleDate)}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Feather name="shield" size={14} color={colors.accent} />
            <Text style={[styles.cardRowText, { color: colors.foreground }]}>
              Status: {donor.status ?? 'active'}
            </Text>
          </View>
        </View>
      </ViewShot>

      {/* Share / Save button */}
      <TouchableOpacity
        onPress={handleShare}
        disabled={sharing}
        activeOpacity={0.75}
        style={[
          styles.shareButton,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
            opacity: sharing ? 0.5 : 1,
          },
        ]}
        accessibilityLabel="Share or save donor card"
      >
        <Feather
          name={Platform.OS === 'web' ? 'download' : 'share-2'}
          size={16}
          color={colors.accent}
        />
        <Text style={[styles.shareButtonText, { color: colors.foreground }]}>
          {sharing
            ? 'Preparing…'
            : Platform.OS === 'web'
            ? 'Download card'
            : 'Share / Save card'}
        </Text>
      </TouchableOpacity>

      <View style={styles.statsGrid}>
        <StatCard
          label="Total donations"
          value={String(donor.totalDonations ?? 0)}
          accentColor={colors.primary}
          icon="droplet"
        />
        <StatCard
          label="Airtime earned (P)"
          value={String(donor.airtimeEarned ?? 0)}
          accentColor={colors.accent}
          icon="smartphone"
        />
      </View>

      <View
        style={[
          styles.historyCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Donation history
        </Text>
        {unitsQuery.isLoading ? (
          <Text style={[styles.historyEmpty, { color: colors.mutedForeground }]}>
            Loading history…
          </Text>
        ) : myUnits.length === 0 ? (
          <View style={styles.historyEmptyWrap}>
            <Feather name="inbox" size={22} color={colors.mutedForeground} />
            <Text
              style={[styles.historyEmpty, { color: colors.mutedForeground }]}
            >
              No donations recorded yet. Visit a collection centre to make your
              first donation.
            </Text>
          </View>
        ) : (
          myUnits.map((unit) => (
            <View key={unit.unitId} style={styles.historyRow}>
              <Feather name="droplet" size={16} color={colors.primary} />
              <View style={styles.historyInfo}>
                <Text
                  style={[styles.historyTitle, { color: colors.foreground }]}
                >
                  {unit.unitId} · {unit.bloodType}
                </Text>
                <Text
                  style={[
                    styles.historyMeta,
                    { color: colors.mutedForeground },
                  ]}
                >
                  {formatDate(unit.collectedAt)} · {unit.status}
                </Text>
              </View>
              {unit.chainHash ? (
                <Feather name="link" size={14} color={colors.accent} />
              ) : null}
            </View>
          ))
        )}
      </View>

      {/* Sign Out / Switch Donor Session */}
      <TouchableOpacity
        onPress={() => {
          clearDonor();
          router.push('/(tabs)/register');
        }}
        activeOpacity={0.75}
        style={[
          styles.signOutButton,
          {
            borderColor: colors.border,
            borderRadius: colors.radius,
            backgroundColor: colors.card,
          },
        ]}
      >
        <Feather name="log-out" size={14} color={colors.destructive} />
        <Text style={[styles.signOutText, { color: colors.destructive }]}>
          Sign Out / Switch Donor
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  signOutText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.5,
  },
  content: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    borderWidth: 1,
    padding: 20,
    gap: 10,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitleWrap: {
    gap: 2,
    flex: 1,
  },
  cardBrand: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1.5,
  },
  cardName: {
    fontSize: 22,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  cardMeta: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  bloodBadge: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloodBadgeText: {
    fontSize: 18,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  cardDivider: {
    height: 1,
    marginVertical: 4,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardRowText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  shareButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  historyCard: {
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
  historyEmptyWrap: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  historyEmpty: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  historyInfo: {
    flex: 1,
    gap: 2,
  },
  historyTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  historyMeta: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  emptyButton: {
    alignSelf: 'stretch',
    marginTop: 12,
  },
  clearButton: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
});
