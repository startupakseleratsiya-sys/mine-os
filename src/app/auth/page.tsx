import { redirect } from "next/navigation";

/** Eski /auth sahifasi — endi /sign-in ishlatiladi. */
export default function LegacyAuthPage() {
  redirect("/sign-in");
}
