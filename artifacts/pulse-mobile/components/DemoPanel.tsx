import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useDonor } from '@/lib/donor-context';
import { useRouter } from 'expo-router';

const DEMO_DONOR_IDS = ['D-2026-0891', 'D-2026-0892', 'D-2026-0893'];

const OTHER_ITEMS = [
  { label: 'BAG #', values: ['BW-2026-008821', 'BW-2026-008777'] },
  { label: 'FACILITY', values: ['FAC-001 (Princess Marina)'] },
];

export function DemoPanel() {
  const colors = useColors();
  const router = useRouter();
  const { setDonorId } = useDonor();
  const [expanded, setExpanded] = useState(false);

  function loadDemoUser(id: string) {
    setDonorId(id);
    router.push('/(tabs)/dashboard');
  }

  return (
    <View style={[styles.container, { bottom: 90 }]} pointerEvents="box-none">
      <View
        style={[
          styles.panel,
          {
            backgroundColor: colors.card,
            borderColor: colors.primary,
          },
          expanded && styles.panelExpanded,
        ]}
      >
        {/* Header row */}
        <TouchableOpacity
          style={styles.header}
          onPress={() => setExpanded((v) => !v)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={expanded ? 'Collapse demo panel' : 'Expand demo panel'}
        >
          <View style={styles.dot} />
          <Text style={[styles.headerText, { color: colors.primary }]}>DEMO</Text>
          <Feather
            name={expanded ? 'chevron-down' : 'chevron-up'}
            size={12}
            color={colors.primary}
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>

        {/* Expanded content */}
        {expanded && (
          <View style={styles.body}>
            <Text style={[styles.note, { color: colors.mutedForeground }]}>
              Tap a donor ID to load it instantly.
            </Text>

            {/* Tappable donor IDs */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
                DONOR IDs
              </Text>
              {DEMO_DONOR_IDS.map((id) => (
                <TouchableOpacity
                  key={id}
                  style={[
                    styles.donorChip,
                    {
                      backgroundColor: colors.primary + '18',
                      borderColor: colors.primary + '44',
                    },
                  ]}
                  onPress={() => loadDemoUser(id)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Load demo donor ${id}`}
                >
                  <Feather name="user" size={10} color={colors.primary} />
                  <Text style={[styles.donorChipText, { color: colors.primary }]}>
                    {id}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Non-interactive reference items */}
            {OTHER_ITEMS.map((item) => (
              <View key={item.label} style={styles.section}>
                <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
                  {item.label}
                </Text>
                {item.values.map((v) => (
                  <Text key={v} style={[styles.value, { color: colors.foreground }]}>
                    {v}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    zIndex: 999,
  },
  panel: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    minWidth: 100,
    maxWidth: 240,
  },
  panelExpanded: {
    minWidth: 210,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#dc2626',
  },
  headerText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1.5,
  },
  body: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    gap: 8,
  },
  note: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    lineHeight: 14,
    marginBottom: 2,
  },
  section: {
    gap: 4,
  },
  sectionLabel: {
    fontSize: 9,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1.2,
    marginBottom: 1,
  },
  donorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
  },
  donorChipText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.3,
  },
  value: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.3,
  },
});
