import { typography } from '../tokens/typography';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { radius } from '../tokens/radius';
import { shadow } from '../tokens/shadow';
import { animation } from '../tokens/animation';
import { icons } from '../tokens/icons';

/**
 * Scalable Unified Theme object combining all primitive design tokens.
 * This can be used in dynamic styles or references in Sprint 2.
 */
export const theme = {
  typography,
  colors,
  spacing,
  radius,
  shadow,
  animation,
  icons,
};

export type Theme = typeof theme;
