import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
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
  const { donorId, setDonorId } = useDonor();

  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [bloodType, setBloodType] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [idNumber, setIdNumber] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

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
        setFormError('Registration failed. Please try again.');
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

  const submit = () => {
    if (!name.trim() || !phone.trim() || !bloodType || !district) {
      setFormError('Name, phone, blood type and district are required.');
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

  if (donorId) {
    return (
      <View
        style={[
          styles.registered,
          { backgroundColor: colors.background, paddingTop: topInset + 40 },
        ]}
      >
        <Feather name="check-circle" size={40} color={colors.accent} />
        <Text style={[styles.registeredTitle, { color: colors.foreground }]}>
          You&apos;re already registered
        </Text>
        <Text
          style={[styles.registeredText, { color: colors.mutedForeground }]}
        >
          Your donor card and history are on your dashboard.
        </Text>
        <PrimaryButton
          title="Go to dashboard"
          testID="go-dashboard"
          onPress={() => router.push('/(tabs)/dashboard')}
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
      <Text style={[styles.title, { color: colors.foreground }]}>
        Become a donor
      </Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
        Every donation earns airtime rewards and saves up to three lives.
      </Text>

      <TextInput
        testID="input-name"
        style={inputStyle}
        placeholder="Full name"
        placeholderTextColor={colors.mutedForeground}
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      <TextInput
        testID="input-phone"
        style={inputStyle}
        placeholder="Phone (+267...)"
        placeholderTextColor={colors.mutedForeground}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
        Blood type
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
        District
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
        testID="input-email"
        style={inputStyle}
        placeholder="Email (optional)"
        placeholderTextColor={colors.mutedForeground}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        testID="input-id"
        style={inputStyle}
        placeholder="Omang / ID number (optional)"
        placeholderTextColor={colors.mutedForeground}
        value={idNumber}
        onChangeText={setIdNumber}
      />

      {formError ? (
        <Text style={[styles.error, { color: colors.destructive }]}>
          {formError}
        </Text>
      ) : null}

      <PrimaryButton
        title="Register as donor"
        testID="submit-register"
        onPress={submit}
        loading={registerMutation.isPending}
      />
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    gap: 14,
  },
  title: {
    fontSize: 26,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginBottom: 4,
  },
  input: {
    height: 52,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 4,
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
  error: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  registered: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  registeredTitle: {
    fontSize: 20,
    fontFamily: 'SpaceGrotesk_700Bold',
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
