import { useWindowDimensions } from 'react-native';

/** Android/iOS "Font size" / large print. 1 is default. */
export function useFontScale(): number {
  const { fontScale } = useWindowDimensions();
  return fontScale || 1;
}

/** Big enough that fixed-height rows and horizontal chip strips start to clip. */
export function useLargePrint(): boolean {
  return useFontScale() >= 1.25;
}

/** Caps for chrome (tabs, chips, search, header). 2.0 matches WCAG resize text. Listing body stays uncapped. */
export const MAX_FONT = {
  chrome: 2,
  title: 2,
} as const;
