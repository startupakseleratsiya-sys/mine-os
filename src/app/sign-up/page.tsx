import { AuthForm } from "@/features/auth/components/auth-form";
import { AuthShell } from "@/features/auth/components/auth-shell";
export default function SignUpPage() { return <AuthShell title="Moliyaviy yo‘lingizni boshlang." description="Bepul hisob yarating va sizga mos o‘quv rejasini oling."><AuthForm mode="sign-up" /></AuthShell>; }
