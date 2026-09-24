import { getI18n } from "@/i18n/server";
import { AuthForm } from "@/features/auth/components/auth-form";
import { AuthShell } from "@/features/auth/components/auth-shell";
export const metadata = { title: "Kirish" };
const NOTICES: Record<string, string> = {
    link: "Havola eskirgan yoki noto'g'ri. Qayta urinib ko'ring.",
    confirmed: "Email tasdiqlandi. Endi kirishingiz mumkin.",
};
export default async function SignInPage({ searchParams, }: {
    searchParams: Promise<{
        next?: string;
        error?: string;
    }>;
}) {
    const { t } = await getI18n();
    const { next, error } = await searchParams;
    const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : undefined;
    return (<AuthShell title={t("Hisobingizga kiring.")} description={t("O\u2018quv progressingiz va AI tutor suhbatlaringizni davom ettiring.")}>
      <AuthForm mode="sign-in" next={safeNext} notice={error ? NOTICES[error] ?? "Xatolik yuz berdi." : undefined}/>
    </AuthShell>);
}
