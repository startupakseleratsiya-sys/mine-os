import { createClient } from "@/lib/supabase-server";
import { formatDateUz } from "@/lib/utils";

type UserRow = {
  id: string;
  full_name: string | null;
  role: "user" | "admin";
  created_at: string;
};

export async function UsersTable({ limit }: { limit?: number }) {
  const supabase = await createClient();
  let query = supabase
    .from("users")
    .select("id, full_name, role, created_at")
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Foydalanuvchilarni yuklab bo&apos;lmadi: {error.message}
      </div>
    );
  }
  const users = (data ?? []) as UserRow[];

  return (
    <div className="overflow-x-auto rounded-xl border border-[#13251f]/10 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[#13251f]/10 bg-[#f8f7f2]">
          <tr>
            <th className="px-6 py-4 font-medium text-[#65736d]">Foydalanuvchi</th>
            <th className="px-6 py-4 font-medium text-[#65736d]">Rol</th>
            <th className="px-6 py-4 font-medium text-[#65736d]">Sana</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#13251f]/5">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-[#f3f1eb]/50">
              <td className="px-6 py-4 font-medium text-[#13251f]">
                {user.full_name || "Ism kiritilmagan"}
                <span className="block text-[11px] font-normal text-[#9aa39f]">{user.id.slice(0, 8)}…</span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    user.role === "admin" ? "bg-[#163e32]/10 text-[#163e32]" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {user.role === "admin" ? "Admin" : "Foydalanuvchi"}
                </span>
              </td>
              <td className="px-6 py-4 text-[#65736d]">{formatDateUz(user.created_at)}</td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={3} className="px-6 py-8 text-center text-[#65736d]">
                Foydalanuvchilar topilmadi.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
