import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '../theme';

/** Wraps chips onto the next line so large print does not clip labels off the screen. */
export function ChipRow({ children, grouped = true }: { children: ReactNode; grouped?: boolean }) {
  return (
    <View style={styles.row} accessibilityRole={grouped ? 'radiogroup' : undefined}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
});
