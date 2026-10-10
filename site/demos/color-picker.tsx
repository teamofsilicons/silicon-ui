import ColorPicker, { type ColorPickerProps, type ColorSwatch } from "@/registry/components/color-picker/color-picker";
import { defineDemo } from "../lib/demo";

const swatches: ColorSwatch[] = [
  { id: "ink", color: "#17171A" },
  { id: "signal", color: "#2F6BFF" },
  { id: "mint", color: "#1FA77A" },
  { id: "amber", color: "#F2A93B" },
  { id: "coral", color: "#E5484D" },
];

/** The panel grows over the swatch toward the lower right; the box leaves it room inside the stage. */
const box = { width: "min(100%, 304px)", minHeight: 500 } as const;

export default defineDemo<ColorPickerProps>({
  props: { label: "Brand accent", defaultValue: "#2F6BFF", defaultSwatches: swatches },
  hideControls: ["value", "defaultValue"],
  Preview: ({ props }) => <div style={box}><ColorPicker {...props} /></div>,
  examples: [
    {
      title: "Translucent, checked against a dark surface",
      description: "The contrast readout compares the color with `background`. Type any hex, RGB, HSL or OKLCH value.",
      render: () => <div style={box}><ColorPicker label="Status badge" defaultValue="#1FA77ACC" background="#111318" defaultFormat="oklch" /></div>,
    },
  ],
  usage: `const [accent, setAccent] = useState("#2F6BFF");

<ColorPicker
  label="Brand accent"
  value={accent}
  onValueChange={setAccent}
  defaultSwatches={[{ id: "ink", color: "#17171A" }, { id: "mint", color: "#1FA77A" }]}
/>`,
});
