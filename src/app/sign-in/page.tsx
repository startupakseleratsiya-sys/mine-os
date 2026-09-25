import { safeNext } from "@/lib/safe-next";
import { getI18n } from "@/i18n/server";
import { AuthForm } from "@/features/auth/components/auth-form";
import { AuthShell } from "@/features/auth/components/auth-shell";
export const metadata = { title: "Sign in" };
const NOTICES: Record<string, string> = {
    link: "The link is expired or invalid. Please try again.",
    confirmed: "Email confirmed. You can now sign in.",
};
export default async function SignInPage({ searchParams, }: {
    searchParams: Promise<{
        next?: string;
        error?: string;
    }>;
}) {
    const { t } = await getI18n();
    const { next, error } = await searchParams;
    const safe = safeNext(next);
    return (<AuthShell title={t("Sign in to your account.")} description={t("Continue your learning and AI tutor conversations.")}>
      <AuthForm mode="sign-in" next={safe} notice={error ? NOTICES[error] ?? "An error occurred." : undefined}/>
    </AuthShell>);
}
