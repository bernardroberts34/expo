import { Column as ComposeColumn, Text as ComposeText } from '@expo/ui/jetpack-compose';
import {
  background,
  clip,
  defaultMinSize,
  fillMaxWidth,
  padding,
  Shapes,
} from '@expo/ui/jetpack-compose/modifiers';

import { extractFieldSectionSlots } from './FieldSectionSlots';
import { getFieldItemPosition, type FieldItemPosition, type FieldSectionProps } from './types';
import { useUniversalLifecycle } from '../hooks';
import { transformToModifiers } from '../transformStyle';

/**
 * Android implementation of [`FieldGroup.Section`](#fieldgroupsection). Each
 * row is wrapped in a Jetpack Compose `Column` that is clipped to a
 * position-aware rounded shape and filled with `surfaceColor`, producing the
 * Material 3 "connected list" look (fully rounded at the section's ends,
 * slightly rounded between rows). Rows are separated by a 2dp gap.
 */
export function FieldSection({
  children,
  title,
  style,
  onAppear,
  onDisappear,
  disabled,
  hidden,
  testID,
  surfaceColor = '#FFFFFF',
  titleUppercase = false,
  modifiers: extraModifiers,
}: FieldSectionProps) {
  useUniversalLifecycle(onAppear, onDisappear);

  if (hidden) return null;

  const { header, footer, rows } = extractFieldSectionSlots(children);

  const outerModifiers = transformToModifiers(style, { disabled, hidden, testID }, [
    fillMaxWidth(),
    ...(extraModifiers ?? []),
  ]);

  const headerNode =
    header ??
    (title ? (
      <ComposeText
        color={TITLE_COLOR}
        style={{
          typography: 'titleMedium',
          letterSpacing: titleUppercase ? 0.5 : undefined,
        }}>
        {titleUppercase ? title.toUpperCase() : title}
      </ComposeText>
    ) : null);

  return (
    <ComposeColumn verticalArrangement={{ spacedBy: 4 }} modifiers={outerModifiers}>
      {headerNode ? (
        <ComposeColumn modifiers={[padding(16, 0, 16, 8)]}>{headerNode}</ComposeColumn>
      ) : null}
      {rows.length > 0 ? (
        <ComposeColumn verticalArrangement={{ spacedBy: 2 }} modifiers={[fillMaxWidth()]}>
          {rows.map((child, index) => {
            const position = getFieldItemPosition(index, rows.length);
            return (
              <ComposeColumn
                key={index}
                verticalArrangement="center"
                modifiers={[
                  fillMaxWidth(),
                  clip(Shapes.RoundedCorner(cornerRadii(position))),
                  background(surfaceColor),
                  defaultMinSize({ minHeight: ROW_MIN_HEIGHT }),
                  padding(ROW_HORIZONTAL_PADDING, 0, ROW_HORIZONTAL_PADDING, 0),
                ]}>
                {child}
              </ComposeColumn>
            );
          })}
        </ComposeColumn>
      ) : null}
      {footer ? <ComposeColumn modifiers={[padding(16, 4, 16, 0)]}>{footer}</ComposeColumn> : null}
    </ComposeColumn>
  );
}

/**
 * Minimum row height, following Material 3's `ListItem` one-line spec (56dp).
 * Comfortably accommodates the 48dp touch targets of `Switch`, `Slider`, and
 * `Checkbox` with a few dp of breathing room, and matches native Android
 * settings conventions. Taller content grows the row naturally via
 * `defaultMinSize`.
 */
const ROW_MIN_HEIGHT = 56;

/**
 * Horizontal inset applied to each row, matching SwiftUI `Form`'s built-in
 * row leading/trailing padding. Saves users from needing to add their own
 * `paddingHorizontal` to every row's content.
 */
const ROW_HORIZONTAL_PADDING = 16;

/**
 * Section title color. iOS-settings-grey; users who want a different color
 * (e.g. a dark-mode-aware theme color) can pass a custom `header` node.
 */
const TITLE_COLOR = '#6c6c70';

/**
 * Per-position corner radii used to produce the Material 3 grouped-list look.
 *
 * - `only`: all four corners fully rounded (single-item section)
 * - `leading`: top corners fully rounded, bottom corners slightly rounded
 * - `trailing`: bottom corners fully rounded, top corners slightly rounded
 * - `middle`: all four corners slightly rounded
 */
function cornerRadii(position: FieldItemPosition) {
  const full = 20;
  const small = 4;
  switch (position) {
    case 'only':
      return { topStart: full, topEnd: full, bottomStart: full, bottomEnd: full };
    case 'leading':
      return { topStart: full, topEnd: full, bottomStart: small, bottomEnd: small };
    case 'trailing':
      return { topStart: small, topEnd: small, bottomStart: full, bottomEnd: full };
    case 'middle':
    default:
      return { topStart: small, topEnd: small, bottomStart: small, bottomEnd: small };
  }
}
