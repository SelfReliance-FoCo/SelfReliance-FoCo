function channel(hex: string, index: number): number {
  return parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16);
}

function linear(value: number): number {
  const channelValue = value / 255;
  return channelValue <= 0.04045 ? channelValue / 12.92 : ((channelValue + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  return 0.2126 * linear(channel(hex, 0)) + 0.7152 * linear(channel(hex, 1)) + 0.0722 * linear(channel(hex, 2));
}

/** WCAG contrast ratio. Both arguments are #rrggbb. */
export function contrast(foreground: string, background: string): number {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function blend(foreground: string, background: string, alpha: number): string {
  const mixed = [0, 1, 2].map((index) =>
    Math.round(channel(foreground, index) * alpha + channel(background, index) * (1 - alpha)),
  );
  return `#${mixed.map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}

function step(hex: string, towardLight: boolean): string {
  const next = [0, 1, 2].map((index) => {
    const value = channel(hex, index);
    const shifted = towardLight ? value + (255 - value) * 0.18 : value * 0.9;
    return Math.max(0, Math.min(255, Math.round(shifted)));
  });
  return `#${next.map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Color that stays at least `minimum` contrast on a translucent tint of itself
 * painted over `surface`. Category pills and status badges use this.
 */
export function inkOnTint(color: string, surface: string, alpha = 0x1a / 255, minimum = 4.5): string {
  const firstTint = blend(color, surface, alpha);
  const towardLight = contrast('#ffffff', firstTint) > contrast('#000000', firstTint);
  let ink = color;
  for (let attempt = 0; attempt < 48; attempt += 1) {
    if (contrast(ink, blend(ink, surface, alpha)) >= minimum) return ink;
    ink = step(ink, towardLight);
  }
  return towardLight ? '#ffffff' : '#1a1020';
}
