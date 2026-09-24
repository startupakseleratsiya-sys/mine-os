import { getI18n } from "@/i18n/server";
import { AuthForm } from "@/features/auth/components/auth-form";
import { AuthShell } from "@/features/auth/components/auth-shell";
export const metadata = { title: "Sign up" };
export default async function SignUpPage() {
    const { t } = await getI18n();
    return (<AuthShell title={t("Moliyaviy yo\u2018lingizni boshlang.")} description={t("Bepul hisob yarating va sizga mos o\u2018quv rejasini oling.")}>
      <AuthForm mode="sign-up"/>
    </AuthShell>);
}
