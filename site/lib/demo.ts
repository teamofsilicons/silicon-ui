import type { ComponentType, ReactNode } from "react";

/**
 * One file per registry item in site/demos/<item-name>.tsx, default-exporting `defineDemo({...})`.
 *
 * The playground reads the item's props from its TypeScript source and builds controls for the simple ones (enums,
 * booleans, numbers, strings). The live preview renders `Preview` (or `component`) with `props` merged under the
 * current control values. Every `on*` callback the component declares is also wired to the event log.
 */
export interface Demo<P extends object = Record<string, unknown>> {
  /** The component under test. Rendered with the merged props when there is no `Preview`. */
  component?: ComponentType<P>;
  /** Base props for the live preview: required data, a realistic label, children. Control values override these. */
  props?: Partial<P>;
  /**
   * A custom live preview, rendered as a component so hooks work. Receives the merged props (base props, then
   * control values, then event-log wrapped callbacks). Use it for controlled components that need state, and for
   * compound components (Dialog, Tabs, Popover) that need their parts composed.
   */
  Preview?: ComponentType<{ props: P }>;
  /** Prop names to leave out of the controls panel (state the preview owns, data arrays, refs). */
  hideControls?: string[];
  /** Enum props to render side by side in Examples. Defaults to every enum control named variant, tone, size, appearance or layout. */
  variants?: string[];
  /** Hand-picked examples shown under Examples, each rendered as a component so hooks work. */
  examples?: DemoExample[];
  /** The usage snippet. Defaults to an import plus a JSX line built from the current control values. */
  usage?: string;
  /** Stage layout. `center` (default) centers small components; `fill` gives blocks and wide components the full width. */
  stage?: { layout?: "center" | "fill"; minHeight?: number };
}

export interface DemoExample {
  title: string;
  description?: string;
  render: () => ReactNode;
  /** Same as Demo.stage, for this example alone. */
  stage?: { layout?: "center" | "fill"; minHeight?: number };
}

export function defineDemo<P extends object>(demo: Demo<P>): Demo<P> {
  return demo;
}
