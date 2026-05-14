import { COURSES } from "@/lib/courses";
import CourseClient from "./Client";

export function generateStaticParams() {
  return COURSES.map((c) => ({ course: c.slug }));
}

export const dynamicParams = false;

export default function Page({ params }: { params: { course: string } }) {
  return <CourseClient course={params.course} />;
}
