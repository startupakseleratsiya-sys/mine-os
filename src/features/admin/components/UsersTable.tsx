import { createClient } from "@/lib/supabase-server";

export async function UsersTable() {
  const supabase = await createClient();
  const { data: users, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });

  if (error) {
    return <div className="text-red-500 text-sm">Foydalanuvchilarni yuklashda xatolik yuz berdi. {error.message}</div>;
  }

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
          {users?.map((user) => (
            <tr key={user.id} className="hover:bg-[#f3f1eb]/50">
              <td className="px-6 py-4 font-medium text-[#13251f]">{user.full_name || 'Ism kiritilmagan'}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${user.role === 'admin' ? 'bg-[#163e32]/10 text-[#163e32]' : 'bg-gray-100 text-gray-700'}`}>
                  {user.role === 'admin' ? 'Admin' : 'Foydalanuvchi'}
                </span>
              </td>
              <td className="px-6 py-4 text-[#65736d]">
                {new Date(user.created_at).toLocaleDateString('uz-UZ')}
              </td>
            </tr>
          ))}
          {(!users || users.length === 0) && (
            <tr>
              <td colSpan={3} className="px-6 py-8 text-center text-[#65736d]">Foydalanuvchilar topilmadi.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
