import { AuthForm } from "@/features/auth/components/auth-form";
import { AuthShell } from "@/features/auth/components/auth-shell";
export default function SignInPage() { return <AuthShell title="Hisobingizga kiring." description="O‘quv progressingiz va AI tutor suhbatlaringizni davom ettiring."><AuthForm mode="sign-in" /></AuthShell>; }
