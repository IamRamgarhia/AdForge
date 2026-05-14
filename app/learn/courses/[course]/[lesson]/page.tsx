import { COURSES } from "@/lib/courses";
import LessonClient from "./Client";

export function generateStaticParams() {
  const out: Array<{ course: string; lesson: string }> = [];
  for (const c of COURSES) {
    for (const l of c.lessons) {
      out.push({ course: c.slug, lesson: l.slug });
    }
  }
  return out;
}

export const dynamicParams = false;

export default function Page({ params }: { params: { course: string; lesson: string } }) {
  return <LessonClient course={params.course} lesson={params.lesson} />;
}
