import { getI18n } from "@/i18n/server";
import { AuthForm } from "@/features/auth/components/auth-form";
import { AuthShell } from "@/features/auth/components/auth-shell";
export const metadata = { title: "Sign up" };
export default async function SignUpPage() {
    const { t } = await getI18n();
    return (<AuthShell title={t("Start your financial learning journey.")} description={t("Create a free account and find a learning path that suits you.")}>
      <AuthForm mode="sign-up"/>
    </AuthShell>);
}
