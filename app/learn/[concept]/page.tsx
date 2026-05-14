import { CONCEPTS } from "@/lib/learn-content";
import ConceptClient from "./Client";

export function generateStaticParams() {
  return CONCEPTS.map((c) => ({ concept: c.slug }));
}

export const dynamicParams = false;

export default function Page({ params }: { params: { concept: string } }) {
  return <ConceptClient concept={params.concept} />;
}
