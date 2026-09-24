import { getI18n } from "@/i18n/server";
import { SectionShell } from "@/components/layouts/section-shell";
import { COURSES, courseMinutes, formatMinutes } from "@/content/courses";
import { getCurrentUser } from "@/services/user-service";
import { courseProgress, getLessonProgress, type LessonProgressRow } from "@/lib/progress";
import { CoursesGrid, type CourseCard } from "./courses-grid";
export const metadata = { title: "Kurslar" };
/** Kurslar ro'yxati ochiq; progress faqat kirgan foydalanuvchi uchun yuklanadi. */
export default async function CoursesPage() {
    const { t } = await getI18n();
    let rows: LessonProgressRow[] = [];
    try {
        const user = await getCurrentUser();
        if (user)
            rows = await getLessonProgress(user.id);
    }
    catch {
        rows = [];
    }
    const cards: CourseCard[] = COURSES.map((course) => {
        const cp = courseProgress(rows, course);
        return {
            slug: course.slug,
            title: course.shortTitle,
            description: course.description,
            level: course.level,
            tag: course.tag,
            icon: course.icon,
            lessons: course.chapters.length,
            time: formatMinutes(courseMinutes(course)),
            completed: cp.completed,
            percent: cp.percent,
            nextChapterId: cp.nextChapter?.id ?? course.chapters[0].id,
        };
    });
    return (<SectionShell eyebrow={t("Ta'lim markazi")} title={t("Moliyani tartib bilan o'rganing.")} description={t("Har bir kurs sodda nazariya, hayotiy misollar va amaliy topshiriqlardan tashkil topgan. Boblarni tugatib boring \u2014 progress avtomatik saqlanadi.")}>
      <CoursesGrid courses={cards}/>
    </SectionShell>);
}
