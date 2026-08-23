import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { PrimaryButton } from '@/components/pulse-ui';
import { useColors } from '@/hooks/useColors';
import { useDonor } from '@/lib/donor-context';
import { Feather } from '@expo/vector-icons';
import { useRegisterDonor } from '@workspace/api-client-react';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const DISTRICTS = [
  'Gaborone',
  'Francistown',
  'Maun',
  'Serowe',
  'Kanye',
  'Molepolole',
  'Selebi-Phikwe',
  'Lobatse',
];

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { donorId, setDonorId, clearDonor } = useDonor();

  // Mode: 'register' | 'login'
  const [mode, setMode] = useState<'register' | 'login'>('register');

  // Register state
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [bloodType, setBloodType] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [idNumber, setIdNumber] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Login state
  const [loginQuery, setLoginQuery] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const registerMutation = useRegisterDonor({
    mutation: {
      onSuccess: (donor) => {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        ).catch(() => {});
        if (donor.donorId) setDonorId(donor.donorId);
        router.replace('/(tabs)/dashboard');
      },
      onError: () => {
        setFormError('Registration failed. Please check network connectivity.');
      },
    },
  });

  const topInset = Platform.OS === 'web' ? 67 : insets.top;

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: colors.radius,
      color: colors.foreground,
    },
  ];

  const submitRegister = () => {
    if (!name.trim() || !phone.trim() || !bloodType || !district) {
      setFormError('Full name, phone, blood group and district are strictly required.');
      return;
    }
    setFormError(null);
    registerMutation.mutate({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        bloodType,
        district,
        ...(email.trim() ? { email: email.trim() } : {}),
        ...(idNumber.trim() ? { idNumber: idNumber.trim() } : {}),
      },
    });
  };

  const submitLogin = async () => {
    const q = loginQuery.trim();
    if (!q) {
      setLoginError('Please enter your Donor ID (e.g. D-2026-0891) or registered phone number.');
      return;
    }
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      // Determine query parameter (Donor ID format vs Phone/Omang)
      const param = q.toUpperCase().startsWith('D-')
        ? `donorId=${encodeURIComponent(q.toUpperCase())}`
        : `phone=${encodeURIComponent(q)}`;

      const res = await fetch(`/api/donors?${param}`);
      if (!res.ok) throw new Error('Lookup failed');

      const data = await res.json();
      if (data.donors && data.donors.length > 0) {
        const found = data.donors[0];
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        setDonorId(found.donorId);
        router.replace('/(tabs)/dashboard');
      } else {
        setLoginError('No donor profile found matching those credentials. Please check or register.');
      }
    } catch {
      setLoginError('Could not verify credentials. Ensure your device is online.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (donorId) {
    return (
      <View
        style={[
          styles.registered,
          { backgroundColor: colors.background, paddingTop: topInset + 40 },
        ]}
      >
        <Feather name="shield" size={44} color={colors.accent} />
        <Text style={[styles.registeredTitle, { color: colors.foreground }]}>
          SOVEREIGN CREDENTIAL ACTIVE
        </Text>
        <Text
          style={[styles.registeredText, { color: colors.mutedForeground }]}
        >
          Active session: <Text style={{ color: colors.primary, fontFamily: 'Inter_700Bold' }}>{donorId}</Text>
        </Text>
        <PrimaryButton
          title="Access My Dashboard"
          testID="go-dashboard"
          onPress={() => router.push('/(tabs)/dashboard')}
          style={styles.registeredButton}
        />
        <PrimaryButton
          title="Sign Out & Enrol New Donor"
          variant="outline"
          onPress={() => {
            clearDonor();
            setMode('register');
          }}
          style={styles.registeredButton}
        />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollViewCompat
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topInset + 16, paddingBottom: 140 },
      ]}
      bottomOffset={24}
      keyboardShouldPersistTaps="handled"
    >
      {/* Critical National Reserve Alert */}
      <View
        style={[
          styles.alertBanner,
          {
            backgroundColor: colors.destructive + '15',
            borderColor: colors.destructive + '40',
            borderRadius: colors.radius,
          },
        ]}
      >
        <Feather name="alert-triangle" size={16} color={colors.destructive} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.alertTitle, { color: colors.destructive }]}>
            CRITICAL NATIONAL DEFICIT WARNING
          </Text>
          <Text style={[styles.alertBody, { color: colors.foreground }]}>
            National blood reserves are operating below minimum threshold. Registered donors receive immediate emergency mobilization alerts.
          </Text>
        </View>
      </View>

      {/* Mode Switcher: Enrol vs Access */}
      <View
        style={[
          styles.modeToggle,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.modeButton,
            mode === 'register' && {
              backgroundColor: colors.primary,
              borderRadius: colors.radius,
            },
          ]}
          onPress={() => setMode('register')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.modeButtonText,
              {
                color: mode === 'register' ? colors.primaryForeground : colors.mutedForeground,
                fontFamily: mode === 'register' ? 'Inter_700Bold' : 'Inter_500Medium',
              },
            ]}
          >
            ENROL DONOR
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeButton,
            mode === 'login' && {
              backgroundColor: colors.accent,
              borderRadius: colors.radius,
            },
          ]}
          onPress={() => setMode('login')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.modeButtonText,
              {
                color: mode === 'login' ? colors.accentForeground : colors.mutedForeground,
                fontFamily: mode === 'login' ? 'Inter_700Bold' : 'Inter_500Medium',
              },
            ]}
          >
            SIGN IN / LOOKUP
          </Text>
        </TouchableOpacity>
      </View>

      {mode === 'register' ? (
        <>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              National Donor Registration
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Enrol into Botswana&apos;s cryptographic blood infrastructure. Each donation saves up to three lives and earns automated Pula airtime.
            </Text>
          </View>

          <TextInput
            testID="input-name"
            style={inputStyle}
            placeholder="Full legal name"
            placeholderTextColor={colors.mutedForeground}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <TextInput
            testID="input-phone"
            style={inputStyle}
            placeholder="Phone number (+267...)"
            placeholderTextColor={colors.mutedForeground}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
            Blood Group (ABO/Rh) *
          </Text>
          <View style={styles.chipsRow}>
            {BLOOD_TYPES.map((type) => {
              const selected = bloodType === type;
              return (
                <Pressable
                  key={type}
                  testID={`blood-${type}`}
                  onPress={() => setBloodType(type)}
                  style={[
                    styles.chip,
                    {
                      borderRadius: colors.radius,
                      borderColor: selected ? colors.primary : colors.border,
                      backgroundColor: selected ? colors.primary : colors.card,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      {
                        color: selected
                          ? colors.primaryForeground
                          : colors.foreground,
                      },
                    ]}
                  >
                    {type}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
            Primary Health District *
          </Text>
          <View style={styles.chipsRow}>
            {DISTRICTS.map((d) => {
              const selected = district === d;
              return (
                <Pressable
                  key={d}
                  testID={`district-${d}`}
                  onPress={() => setDistrict(d)}
                  style={[
                    styles.chip,
                    {
                      borderRadius: colors.radius,
                      borderColor: selected ? colors.accent : colors.border,
                      backgroundColor: selected ? colors.accent : colors.card,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      {
                        color: selected
                          ? colors.accentForeground
                          : colors.foreground,
                      },
                    ]}
                  >
                    {d}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <TextInput
            testID="input-id"
            style={inputStyle}
            placeholder="National ID / Omang (Optional)"
            placeholderTextColor={colors.mutedForeground}
            value={idNumber}
            onChangeText={setIdNumber}
          />

          <TextInput
            testID="input-email"
            style={inputStyle}
            placeholder="Email address (Optional)"
            placeholderTextColor={colors.mutedForeground}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {formError ? (
            <View style={styles.errorRow}>
              <Feather name="x-circle" size={14} color={colors.destructive} />
              <Text style={[styles.error, { color: colors.destructive }]}>
                {formError}
              </Text>
            </View>
          ) : null}

          {/* Clean Compliance & Testing Disclaimer */}
          <View
            style={[
              styles.disclaimerBox,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <View style={styles.disclaimerHeader}>
              <Feather name="lock" size={12} color={colors.accent} />
              <Text style={[styles.disclaimerTitle, { color: colors.accent }]}>
                DATA CONSENT &amp; APPLIED TELEMETRY
              </Text>
            </View>
            <Text style={[styles.disclaimerText, { color: colors.mutedForeground }]}>
              By enlisting as a donor, you explicitly consent to the recording of your eligibility status and anonymized donation telemetry for application testing, performance auditing, and algorithmic distribution (Torrent protocol) under the Ministry of Health framework. Personal identities are decoupled via cryptographic hashing.
            </Text>
          </View>

          <PrimaryButton
            title="Enrol as National Donor"
            testID="submit-register"
            onPress={submitRegister}
            loading={registerMutation.isPending}
          />
        </>
      ) : (
        /* Sign In / Existing Donor Lookup */
        <>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              Retrieve Donor Credential
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Access your digital donor card, review verifiable donation hashes, and track accrued airtime incentives.
            </Text>
          </View>

          <TextInput
            style={inputStyle}
            placeholder="Donor ID (e.g. D-2026-0891) or Phone (+267...)"
            placeholderTextColor={colors.mutedForeground}
            value={loginQuery}
            onChangeText={setLoginQuery}
            autoCapitalize="characters"
            autoCorrect={false}
          />

          {loginError ? (
            <View style={styles.errorRow}>
              <Feather name="alert-circle" size={14} color={colors.destructive} />
              <Text style={[styles.error, { color: colors.destructive }]}>
                {loginError}
              </Text>
            </View>
          ) : null}

          {/* Clean Compliance & Testing Disclaimer */}
          <View
            style={[
              styles.disclaimerBox,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <View style={styles.disclaimerHeader}>
              <Feather name="shield" size={12} color={colors.accent} />
              <Text style={[styles.disclaimerTitle, { color: colors.accent }]}>
                SESSION VERIFICATION &amp; TELEMETRY
              </Text>
            </View>
            <Text style={[styles.disclaimerText, { color: colors.mutedForeground }]}>
              Logging in authorizes access to your Strand ledger records. Anonymous session telemetry is evaluated for platform load testing and emergency response drills.
            </Text>
          </View>

          <PrimaryButton
            title={isLoggingIn ? "Verifying Ledger..." : "Sign In & Retrieve Card"}
            onPress={submitLogin}
            loading={isLoggingIn}
          />
        </>
      )}
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    gap: 14,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    padding: 14,
    marginBottom: 6,
  },
  alertTitle: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
    marginBottom: 2,
  },
  alertBody: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 16,
  },
  modeToggle: {
    flexDirection: 'row',
    borderWidth: 1,
    padding: 4,
    marginBottom: 8,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeButtonText: {
    fontSize: 12,
    letterSpacing: 1,
  },
  header: {
    gap: 4,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
  input: {
    height: 52,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  fieldLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  disclaimerBox: {
    borderWidth: 1,
    padding: 12,
    gap: 6,
    marginVertical: 4,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  disclaimerTitle: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1.2,
  },
  disclaimerText: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    lineHeight: 16,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  error: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  registered: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  registeredTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1.2,
  },
  registeredText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  registeredButton: {
    alignSelf: 'stretch',
    marginTop: 12,
  },
});

