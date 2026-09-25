import { getI18n } from "@/i18n/server";
import { redirect } from "next/navigation";
import { SectionShell } from "@/components/layouts/section-shell";
import { TOTAL_CHAPTERS } from "@/content/courses";
import { getChatSessionCount, getCurrentUser } from "@/services/user-service";
import { achievements, activeCourse, computeStreak, getLessonProgress, recentLessons, relativeDay, totalMinutesLearned, weeklyActivity, } from "@/lib/progress";
import { ProgressView } from "./progress-view";
export const metadata = { title: "Progress" };
export default async function ProgressPage() {
    const { t } = await getI18n();
    const user = await getCurrentUser();
    if (!user)
        redirect("/sign-in?next=/progress");
    const [rows, chatCount] = await Promise.all([getLessonProgress(user.id), getChatSessionCount(user.id)]);
    const active = activeCourse(rows);
    return (<SectionShell eyebrow={t("My results")} title={t("See how your knowledge is growing.")} description={t("Progress includes concepts understood, practical habits and goals achieved, not just a score.")}>
      <ProgressView totalCompleted={rows.length} totalChapters={TOTAL_CHAPTERS} minutesLearned={totalMinutesLearned(rows)} streak={computeStreak(rows)} weekly={weeklyActivity(rows).map(({ day, lessons, minutes, isToday }) => ({ day, lessons, minutes, isToday }))} recent={recentLessons(rows).map((r) => ({
            title: r.chapter.title,
            course: r.course.shortTitle,
            when: relativeDay(r.completedAt),
            href: `/study/${r.course.slug}/${r.chapter.id}`,
        }))} achievements={achievements(rows, chatCount)} active={{
            title: active.course.title,
            percent: active.percent,
            remaining: active.total - active.completed,
            href: active.nextChapter ? `/study/${active.course.slug}/${active.nextChapter.id}` : `/courses/${active.course.slug}`,
        }}/>
    </SectionShell>);
}
