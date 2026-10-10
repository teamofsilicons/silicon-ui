import { useState } from "react";

import Carousel, { type CarouselProps } from "@/registry/components/carousel/carousel";
import { SiliconImage } from "@/lib/silicon-provider";
import { photo, type PhotoId } from "@/lib/media";
import { defineDemo } from "../lib/demo";

const venues: { id: PhotoId; title: string; detail: string }[] = [
  { id: "lisbon-rooftops", title: "Lisbon", detail: "3 nights · 24 people · from $1,180" },
  { id: "alpine-lake", title: "Lake Bled", detail: "2 nights · 18 people · from $940" },
  { id: "coastline", title: "Algarve coast", detail: "3 nights · 30 people · from $1,320" },
  { id: "sunroom", title: "Cotswolds farmhouse", detail: "2 nights · 16 people · from $860" },
  { id: "pool-house", title: "Palm Springs", detail: "4 nights · 22 people · from $1,640" },
];

function Venue({ id, title, detail }: (typeof venues)[number]) {
  const image = photo(id);
  return <figure style={{ margin: 0, overflow: "hidden", border: "1px solid var(--border)", borderRadius: 16, background: "var(--surface)" }}>
    <div style={{ position: "relative", aspectRatio: "4 / 3" }}>
      <SiliconImage src={image.src} alt={image.alt} fill sizes="340px" loading="eager" draggable={false} style={{ objectFit: "cover" }} />
    </div>
    <figcaption style={{ display: "grid", gap: 2, padding: "12px 14px 14px" }}>
      <strong style={{ fontSize: 15, fontWeight: 500 }}>{title}</strong>
      <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{detail}</span>
    </figcaption>
  </figure>;
}

export default defineDemo<CarouselProps>({
  props: { label: "Offsite venues", interval: 4000 },
  hideControls: ["index", "defaultIndex"],
  Preview: ({ props }) => {
    const [index, setIndex] = useState(1);
    return <div style={{ width: "min(100%, 760px)" }}>
      <Carousel {...props} index={index} onIndexChange={next => { setIndex(next); props.onIndexChange?.(next); }}>
        {venues.map(venue => <Venue key={venue.id} {...venue} />)}
      </Carousel>
    </div>;
  },
  stage: { layout: "fill" },
  usage: `<Carousel label="Offsite venues" interval={4000}>
  <VenueCard title="Lisbon" />
  <VenueCard title="Lake Bled" />
  <VenueCard title="Algarve coast" />
</Carousel>`,
});
