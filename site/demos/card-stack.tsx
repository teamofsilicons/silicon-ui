import CardStack, { type CardStackProps } from "@/registry/components/card-stack/card-stack";
import { Button } from "@/registry/components/button/button";
import { ArcImage } from "@/lib/arc-provider";
import { photo, type PhotoId } from "@/lib/media";
import { defineDemo } from "../lib/demo";

type Venue = { id: PhotoId; city: string; detail: string };

const venues: Venue[] = [
  { id: "lisbon-tram", city: "Lisbon", detail: "3 nights · from $1,180 per person" },
  { id: "alpine-lake", city: "Lake Bled", detail: "2 nights · from $940 per person" },
  { id: "restaurant", city: "Copenhagen", detail: "3 nights · from $1,410 per person" },
  { id: "terracotta-waves", city: "Marrakesh", detail: "4 nights · from $1,050 per person" },
  { id: "sea-at-dusk", city: "Split", detail: "3 nights · from $990 per person" },
];

function VenueCard({ id, city, detail }: Venue) {
  const image = photo(id);
  return <div style={{ display: "grid", gridTemplateRows: "1fr auto", height: "100%" }}>
    <div style={{ position: "relative", minHeight: 0 }}>
      <ArcImage src={image.src} alt={image.alt} fill sizes="320px" draggable={false} style={{ objectFit: "cover" }} />
    </div>
    <div style={{ display: "grid", gap: 2, padding: "12px 16px 14px" }}>
      <strong style={{ fontSize: 16, fontWeight: 500 }}>{city}</strong>
      <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{detail}</span>
    </div>
  </div>;
}

export default defineDemo<CardStackProps<Venue>>({
  props: {
    items: venues,
    getKey: venue => venue.id,
    getLabel: venue => venue.city,
    renderCard: venue => <VenueCard {...venue} />,
    labels: { left: "Skip", right: "Shortlist" },
    outcomes: { left: "skipped", right: "shortlisted" },
    label: "Offsite destinations",
    renderEmpty: reset => <div style={{ display: "grid", gap: 12, justifyItems: "center", padding: 24, textAlign: "center", color: "var(--text-secondary)", fontSize: 14 }}>
      <span>You have seen every destination. The shortlist goes to the planning silicon.</span>
      <Button variant="secondary" size="sm" onClick={reset}>Start over</Button>
    </div>,
  },
  hideControls: ["items"],
  Preview: ({ props }) => <div style={{ width: "min(100%, 360px)" }}><CardStack {...props} /></div>,
  stage: { minHeight: 480 },
  usage: `<CardStack
  label="Offsite destinations"
  items={venues}
  getKey={venue => venue.id}
  getLabel={venue => venue.city}
  renderCard={venue => <VenueCard {...venue} />}
  labels={{ left: "Skip", right: "Shortlist" }}
  outcomes={{ left: "skipped", right: "shortlisted" }}
  onDecide={(venue, decision) => save(venue.id, decision)}
/>`,
});
