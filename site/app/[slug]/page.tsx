import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ItemPage } from "../../components/item-page";
import { catalog, related } from "../../lib/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(catalog.items).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const item = catalog.items[(await params).slug];
  return item ? { title: item.title, description: item.description } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const item = catalog.items[(await params).slug];
  if (!item) notFound();
  // Keyed by item, so every piece of preview state starts fresh on navigation.
  return <ItemPage key={item.name} item={item} related={related(item)} />;
}
