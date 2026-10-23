import { readFileSync } from 'node:fs';
import { contrast, inkOnTint } from '../src/lib/contrast.ts';

function palette(name) {
  const source = readFileSync(new URL('../src/theme.ts', import.meta.url), 'utf8');
  const match = source.match(new RegExp(`export const ${name}: ThemeColors = \\{([\\s\\S]*?)\\n\\};`));
  if (!match) throw new Error(`missing ${name} palette`);
  const colors = {};
  for (const entry of match[1].matchAll(/(\w+): '(#[0-9A-Fa-f]{6})'/g)) colors[entry[1]] = entry[2];
  return colors;
}

function hexes(relativePath) {
  const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8');
  return [...source.matchAll(/color: '(#[0-9A-Fa-f]{6})'/g)].map((match) => match[1]);
}

const light = palette('lightColors');
const dark = palette('darkColors');
const header = '#522f81';
let failed = false;

function expect(ratio, minimum, label) {
  if (ratio < minimum) {
    failed = true;
    console.error(`${label}: ${ratio.toFixed(2)}:1 is below ${minimum}:1`);
  }
}

function textOn(colors, surfaces, key) {
  for (const surface of surfaces) expect(contrast(colors[key], colors[surface]), 4.5, `${key} on ${surface}`);
}

textOn(light, ['bg', 'card'], 'muted');
textOn(light, ['bg', 'card'], 'accent');
textOn(light, ['bg', 'card'], 'warning');
textOn(light, ['bg', 'card'], 'green');
textOn(light, ['bg', 'card'], 'red');
textOn(dark, ['bg', 'card'], 'muted');
textOn(dark, ['bg', 'card'], 'accent');
textOn(dark, ['bg', 'card'], 'warning');
textOn(dark, ['bg', 'card'], 'green');
textOn(dark, ['bg', 'card'], 'red');

for (const [colors, label] of [
  [light, 'light'],
  [dark, 'dark'],
]) {
  expect(contrast('#ffffff', colors.callFill), 4.5, `white on ${label} call button`);
  expect(contrast(colors.inputBorder, colors.bg), 3, `${label} search border on page`);
  expect(contrast(colors.inputBorder, colors.card), 3, `${label} search border on card`);
}

expect(contrast('#ffffff', header), 4.5, 'white on header');
expect(contrast('#e9dffb', header), 4.5, 'header subtitle');

const surfaces = [light.bg, light.card, dark.bg, dark.card];
const branded = [...hexes('../src/data/categories.ts'), ...hexes('../src/data/openNowNeeds.ts')];
for (const color of branded) {
  for (const surface of surfaces) {
    const ink = inkOnTint(color, surface);
    expect(contrast(ink, blendCheck(ink, surface, 0x1a / 255)), 4.5, `pill ${color} on ${surface}`);
  }
}

for (const [color, surface, alpha] of [
  [light.green, light.card, 0x1f / 255],
  [dark.green, dark.card, 0x22 / 255],
  [light.warning, light.card, 0x22 / 255],
  [dark.warning, dark.card, 0x22 / 255],
]) {
  const ink = inkOnTint(color, surface, alpha);
  expect(contrast(ink, blendCheck(ink, surface, alpha)), 4.5, `badge ${color} on ${surface}`);
}

if (failed) process.exit(1);
console.log(`OK: contrast for theme pairs and ${branded.length} branded colors`);

function blendCheck(foreground, background, alpha) {
  const channel = (hex, index) => parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16);
  const mixed = [0, 1, 2].map((index) =>
    Math.round(channel(foreground, index) * alpha + channel(background, index) * (1 - alpha)),
  );
  return `#${mixed.map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}
