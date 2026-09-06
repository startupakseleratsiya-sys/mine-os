import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase-middleware";

/**
 * Next 16: middleware → proxy. Butun auth mantiqi (sessiya yangilash, himoyalangan
 * yo'llar, admin tekshiruvi) bitta joyda — lib/supabase-middleware.ts.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Quyidagilardan tashqari hamma yo'l:
     * - _next/static, _next/image
     * - favicon.ico va statik rasm/ikonlar
     * - /api/* (API route'lar o'z auth tekshiruvini qiladi)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
