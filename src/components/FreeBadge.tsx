import { StyleSheet, Text, View } from 'react-native';

import { useI18n } from '../i18n';
import { inkOnTint } from '../lib/contrast';
import { MAX_FONT } from '../lib/fontScale';
import { radius, useTheme } from '../theme';

/** Shown next to a certificate title when the listed credential does not cost money. */
export function FreeBadge() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const ink = inkOnTint(colors.green, colors.card, 0x1f / 255);
  return (
    <View
      style={[styles.badge, { backgroundColor: `${ink}1f` }]}
      accessibilityRole="text"
      accessibilityLabel={t('detail.free')}
    >
      <Text style={[styles.text, { color: ink }]} maxFontSizeMultiplier={MAX_FONT.chrome}>
        {t('detail.free')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    alignSelf: 'center',
  },
  text: { fontSize: 12, fontWeight: '800', letterSpacing: 0.2 },
});
