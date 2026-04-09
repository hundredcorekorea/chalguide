import guidesData from "@/data/guides.json";
import GuideDetailClient from "./GuideDetailClient";

export function generateStaticParams() {
  return guidesData.guides.map((g) => ({ id: g.id }));
}

export default async function GuideDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GuideDetailClient id={id} />;
}
