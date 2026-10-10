import { useState } from "react";

import ImageCompare, { type ImageCompareProps } from "@/registry/components/image-compare/image-compare";
import { ArcImage } from "@/lib/arc-provider";
import { photo } from "@/lib/media";
import { defineDemo } from "../lib/demo";

const room = photo("living-room");
const ridges = photo("mountain-ridges");

// One photo, two treatments: a flat, desaturated "raw" look against the graded original.
const raw = { filter: "grayscale(.85) contrast(.85) brightness(1.05)" } as const;

export default defineDemo<ImageCompareProps>({
  props: {
    before: <ArcImage src={ridges.src} loading="eager" alt={`${ridges.alt}, ungraded`} width={ridges.width} height={ridges.height} style={raw} />,
    after: <ArcImage src={ridges.src} loading="eager" alt={`${ridges.alt}, color graded`} width={ridges.width} height={ridges.height} />,
    labels: ["Raw", "Graded"],
    label: "Color grade",
  },
  hideControls: ["position"],
  Preview: ({ props }) => {
    const [position, setPosition] = useState(props.defaultPosition ?? 50);
    return <div style={{ width: "min(100%, 640px)" }}>
      <ImageCompare {...props} position={position} onPositionChange={next => { setPosition(next); props.onPositionChange?.(next); }} />
    </div>;
  },
  examples: [
    {
      title: "Vertical",
      description: "Stacks the images top and bottom; arrow keys still move the divider.",
      render: () => <div style={{ width: "min(100%, 360px)" }}>
        <ImageCompare
          orientation="vertical"
          aspectRatio="3 / 4"
          labels={["Before", "After"]}
          label="Room restyle"
          before={<ArcImage src={room.src} loading="eager" alt={`${room.alt}, before`} width={room.width} height={room.height} style={raw} />}
          after={<ArcImage src={room.src} loading="eager" alt={`${room.alt}, after`} width={room.width} height={room.height} />}
        />
      </div>,
    },
  ],
  usage: `<ImageCompare
  label="Color grade"
  labels={["Raw", "Graded"]}
  before={<img src="/raw.jpg" alt="Mountain ridges, ungraded" />}
  after={<img src="/graded.jpg" alt="Mountain ridges, color graded" />}
/>`,
});
