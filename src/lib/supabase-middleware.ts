import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Kirish talab qiladigan yo'llar (prefiks). */
export const PROTECTED_PATHS = [
  "/dashboard",
  "/progress",
  "/tutor",
  "/calculators",
  "/profile",
  "/study",
  "/onboarding",
  "/admin",
];

/** Kirgan foydalanuvchi ko'rmasligi kerak bo'lgan sahifalar. */
export const AUTH_PATHS = ["/sign-in", "/sign-up"];

/**
 * Supabase sessiyasini yangilaydi va yo'naltirishlarni bajaradi.
 * Muhim: redirect javobiga ham yangilangan cookie'lar ko'chiriladi, aks holda
 * yangilangan token yo'qolib, foydalanuvchi "chiqib ketgan"dek bo'lib qoladi.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase env o'zgaruvchilari yo'q. Auth proxy o'tkazib yuborildi.");
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // getUser() — tokenni serverda tekshiradi (getSession'dan farqli).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  const redirectWithCookies = (to: string) => {
    const url = request.nextUrl.clone();
    url.pathname = to;
    url.search = "";
    const redirect = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  };

  const isProtected = PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isAuthPage = AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    const redirect = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }

  if (user && isAuthPage) {
    return redirectWithCookies("/dashboard");
  }

  if (user && pathname.startsWith("/admin")) {
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).maybeSingle();
    if (profile?.role !== "admin") {
      return redirectWithCookies("/dashboard");
    }
  }

  return supabaseResponse;
}
