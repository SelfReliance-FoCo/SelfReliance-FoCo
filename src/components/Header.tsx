import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useI18n } from '../i18n';
import { APP_VERSION, BUILD_DATE, DATA_AS_OF } from '../lib/releaseInfo';
import { MAX_FONT } from '../lib/fontScale';
import { HEADER_PURPLE, spacing, useTheme } from '../theme';
import { Heading } from './a11y';
import { HeaderLanguageButton } from './LanguagePicker';

type Props = {
  title: string;
  subtitle: string;
};

export function Header({ title, subtitle }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark, toggle } = useTheme();
  const { t } = useI18n();
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + spacing.md }]}>
      <Image source={require('../../assets/splash-icon.png')} style={styles.logo} accessibilityIgnoresInvertColors />
      <View style={styles.text}>
        <Heading level={1} style={styles.title} maxFontSizeMultiplier={MAX_FONT.title}>
          {title}
        </Heading>
        <Text style={styles.subtitle} maxFontSizeMultiplier={MAX_FONT.chrome}>
          {subtitle}
        </Text>
        <Text style={styles.build} maxFontSizeMultiplier={MAX_FONT.chrome}>
          {t('header.buildInfo', { version: APP_VERSION, built: BUILD_DATE, date: DATA_AS_OF })}
        </Text>
      </View>
      <HeaderLanguageButton />
      <Pressable
        onPress={toggle}
        hitSlop={10}
        style={styles.modeBtn}
        accessibilityRole="button"
        accessibilityLabel={isDark ? t('header.darkToLight') : t('header.darkToDark')}
      >
        <Ionicons name={isDark ? 'sunny' : 'moon'} size={22} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: HEADER_PURPLE,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  logo: { width: 48, height: 48, borderRadius: 24, marginTop: 2 },
  text: { flex: 1, minWidth: 0 },
  title: { color: '#fff', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#e9dffb', fontSize: 14, marginTop: 4 },
  build: { color: '#ffffff', fontSize: 13, marginTop: 6, lineHeight: 18 },
  modeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    marginTop: 2,
  },
});
