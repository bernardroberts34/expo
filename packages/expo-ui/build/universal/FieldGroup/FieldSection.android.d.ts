import { type FieldSectionProps } from './types';
/**
 * Android implementation of [`FieldGroup.Section`](#fieldgroupsection). Each
 * row is wrapped in a Jetpack Compose `Column` that is clipped to a
 * position-aware rounded shape and filled with `surfaceColor`, producing the
 * Material 3 "connected list" look (fully rounded at the section's ends,
 * slightly rounded between rows). Rows are separated by a 2dp gap.
 */
export declare function FieldSection({ children, title, style, onAppear, onDisappear, disabled, hidden, testID, surfaceColor, titleUppercase, modifiers: extraModifiers, }: FieldSectionProps): import("react").JSX.Element | null;
//# sourceMappingURL=FieldSection.android.d.ts.map