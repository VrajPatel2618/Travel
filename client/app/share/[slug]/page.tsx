import { SharedItineraryPage } from "@/components/traveloop-pages";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <SharedItineraryPage slug={slug} />;
}
