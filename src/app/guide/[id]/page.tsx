import guidesData from "@/data/guides.json";
import GuideDetailClient from "./GuideDetailClient";

export function generateStaticParams() {
  return guidesData.guides.map((g) => ({ id: g.id }));
}

export default function GuideDetailPage({ params }: { params: { id: string } }) {
  return <GuideDetailClient id={params.id} />;
}
