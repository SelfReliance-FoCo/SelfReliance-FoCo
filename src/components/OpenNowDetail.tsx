import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OPEN_NEED_MAP, OPEN_NEEDS } from '../data/openNowNeeds';
import type { OpenPlace } from '../data/openNowTypes';
import { useI18n, type MessageKey } from '../i18n';
import { call, directions, hasStreetAddress, open, prettyUrl } from '../lib/actions';
import { useBackLayer } from '../lib/backStack';
import { inkOnTint } from '../lib/contrast';
import { MAX_FONT } from '../lib/fontScale';
import type { PlaceStatus } from '../lib/openNowStatus';
import { radius, spacing, useTheme } from '../theme';
import { englishProps, Heading } from './a11y';

type Props = {
  place: OpenPlace | null;
  status: PlaceStatus | null;
  onClose: () => void;
};

export function OpenNowDetail({ place, status, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t } = useI18n();
  const { handleClose } = useBackLayer(place != null, onClose);
  if (!place) return null;
  const need = OPEN_NEED_MAP[place.needs[0]] ?? OPEN_NEEDS[0];
  const ink = inkOnTint(need.color, colors.bg);
  const statusRaw = status?.kind === 'open' ? colors.green : status?.kind === 'later' ? colors.warning : colors.muted;
  const statusColor = statusRaw ? inkOnTint(statusRaw, colors.bg) : colors.muted;

  return (
    <Modal visible animationType="slide" onRequestClose={handleClose} presentationStyle="pageSheet">
      <View style={[styles.sheet, { paddingTop: Math.max(insets.top, spacing.md), backgroundColor: colors.bg }]}>
        <View style={styles.topBar}>
          <View style={[styles.pill, { backgroundColor: `${ink}1a` }]}>
            <Ionicons name={need.icon as never} size={16} color={ink} />
            <Text style={[styles.pillText, { color: ink }]}>{t(`open.${need.id}Full` as MessageKey)}</Text>
          </View>
          <Pressable onPress={handleClose} hitSlop={12} accessibilityRole="button" accessibilityLabel={t('detail.close')}>
            <Ionicons name="close" size={28} color={colors.ink} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}>
          {status ? (
            <Text style={[styles.status, { color: statusColor }]} maxFontSizeMultiplier={MAX_FONT.chrome}>
              {status.label}
            </Text>
          ) : null}
          <Heading level={1} style={[styles.name, { color: colors.ink }]} maxFontSizeMultiplier={MAX_FONT.title} {...englishProps()}>
            {place.name}
          </Heading>
          <Text style={[styles.who, { color: colors.muted }]} {...englishProps()}>
            {place.who}
          </Text>
          {place.confirm ? (
            <Text style={[styles.warn, { color: colors.warning }]}>{t('open.warnHours')}</Text>
          ) : null}
          <Text style={[styles.desc, { color: colors.body }]} {...englishProps()}>
            {place.description}
          </Text>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color={colors.muted} />
            <Text style={[styles.infoText, { color: colors.body }]} {...englishProps()}>
              {place.hoursNote}
            </Text>
          </View>
          {place.address ? (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color={colors.muted} />
              <Text style={[styles.infoText, { color: colors.body }]} {...englishProps()}>
                {place.address}
              </Text>
            </View>
          ) : null}
          <View style={styles.actions}>
            {place.phone ? (
              <ActionButton icon="call" label={t('detail.call', { phone: place.phone })} color={colors.green} onPress={() => call(place.phone as string)} />
            ) : null}
            {place.url ? (
              <ActionButton
                icon="globe-outline"
                label={prettyUrl(place.url)}
                color={colors.accent}
                onPress={() => open(place.url as string)}
              />
            ) : null}
            {place.address && hasStreetAddress(place.address) ? (
              <>
                <ActionButton
                  icon="navigate-outline"
                  label={t('detail.directions')}
                  color={colors.accent}
                  onPress={() => directions(place.address as string)}
                />
                <ActionButton
                  icon="bus-outline"
                  label={t('detail.bus')}
                  color={colors.accent}
                  onPress={() => directions(place.address as string, 'transit')}
                />
              </>
            ) : null}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

function ActionButton({
  icon,
  label,
  color,
  onPress,
}: {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.action, { borderColor: color }]} accessibilityRole="button" accessibilityLabel={label}>
      <Ionicons name={icon as never} size={20} color={color} />
      <Text style={[styles.actionText, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sheet: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillText: { fontWeight: '700', fontSize: 13 },
  content: { paddingHorizontal: spacing.lg, gap: spacing.md },
  status: { fontSize: 14, fontWeight: '800' },
  name: { fontSize: 26, fontWeight: '800', lineHeight: 32 },
  who: { fontSize: 15 },
  warn: { fontSize: 15, lineHeight: 22, fontWeight: '600' },
  desc: { fontSize: 17, lineHeight: 24 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  infoText: { flex: 1, fontSize: 16, lineHeight: 22 },
  actions: { gap: spacing.sm, marginTop: spacing.sm },
  action: {
    borderWidth: 2,
    borderRadius: radius.lg,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionText: { fontWeight: '800', fontSize: 16, flex: 1 },
});
