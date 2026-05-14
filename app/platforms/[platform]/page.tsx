import { PLATFORM_HUBS } from "@/lib/platform-hubs";
import PlatformClient from "./Client";

// Pre-render every known platform slug so direct navigation works under
// static export and Vercel's edge runtime. (Audit finding #18.)
export function generateStaticParams() {
  return Object.keys(PLATFORM_HUBS).map((platform) => ({ platform }));
}

export const dynamicParams = false;

export default function Page({ params }: { params: { platform: string } }) {
  return <PlatformClient platform={params.platform} />;
}
