/**
 * ?next= faqat sayt ichidagi yo'l bo'lsin: "/..." bilan boshlanadi, "//" yoki "/\" emas (brauzer ularni
 * boshqa saytga olib boruvchi manzil deb tushunadi), boshqaruv belgilarisiz. Aks holda — undefined.
 */
export function safeNext(next: string | null | undefined): string | undefined {
  if (!next || next.length > 300) return undefined;
  let decoded = next;
  try {
    decoded = decodeURIComponent(next);
  } catch {
    return undefined;
  }
  for (const v of [next, decoded]) {
    if (!v.startsWith("/") || v.startsWith("//") || v.startsWith("/\\") || /[\\\x00-\x1f]/.test(v)) return undefined;
  }
  return next;
}
