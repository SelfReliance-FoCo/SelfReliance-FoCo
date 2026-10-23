import { Platform, Text, type AccessibilityRole, type AccessibilityState, type TextProps } from 'react-native';

type HeadingProps = TextProps & { level?: 1 | 2 | 3 };

function webOnly(props: Record<string, unknown>): TextProps {
  if (Platform.OS !== 'web') return {};
  return props as TextProps;
}

/** Screen title or section heading. On web, also sets the heading level. */
export function Heading({ level = 1, ...props }: HeadingProps) {
  return <Text accessibilityRole="header" {...webOnly({ 'aria-level': level })} {...props} />;
}

function webAria(props: Record<string, unknown>): Record<string, unknown> {
  return Platform.OS === 'web' ? props : {};
}

/** Single-select filter. `aria-checked` is what web screen readers actually read. */
export function radioProps(on: boolean, extra?: AccessibilityState) {
  return {
    accessibilityRole: 'radio' as AccessibilityRole,
    accessibilityState: { ...extra, checked: on },
    ...webAria({ 'aria-checked': on }),
  };
}

/** Tab inside a tablist. */
export function tabProps(on: boolean) {
  return {
    accessibilityRole: 'tab' as AccessibilityRole,
    accessibilityState: { selected: on },
    ...webAria({ 'aria-selected': on }),
  };
}

/** English listing copy inside a translated interface. */
export function englishProps(): TextProps {
  if (Platform.OS === 'web') return webOnly({ lang: 'en' });
  if (Platform.OS === 'ios') return { accessibilityLanguage: 'en' };
  return {};
}
