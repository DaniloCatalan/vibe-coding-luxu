import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import UserRoleSelect from "./UserRoleSelect";

export default async function UsersTab() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );

  const { data: authData, error: authError } = await supabase.auth.getUser();
  const allCookies = cookieStore.getAll().map(c => c.name);
  console.log("Cookies in UsersTab:", allCookies);
  console.log("Auth inside UsersTab:", authData?.user?.id, authError?.message);

  const { data: users, error } = await supabase.rpc("get_all_users");

  if (error) {
    const errorDetails = {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      user_id: authData?.user?.id || 'null',
      cookies_found: allCookies.join(', ') || 'none'
    };
    console.error("Error fetching users. Full details:", JSON.stringify(errorDetails, null, 2));
    return (
      <div className="p-4 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800/30">
        <h3 className="font-bold mb-2">Error loading users</h3>
        <pre className="text-xs whitespace-pre-wrap font-mono">
          {JSON.stringify(errorDetails, null, 2)}
        </pre>
        <p className="mt-4 text-sm">Make sure the database script was executed and you are logged in as an admin.</p>
      </div>
    );
  }

  return (
    <>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-[#152e2a] p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
            <p className="text-2xl font-bold text-nordic dark:text-white mt-1">{users?.length || 0}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-icons">people</span>
          </div>
        </div>
      </div>

      {/* Users List Container */}
      <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-200 dark:border-primary/20 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 dark:bg-primary/5 border-b border-gray-100 dark:border-primary/10 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <div className="col-span-4">User Details</div>
          <div className="col-span-4">Date Joined</div>
          <div className="col-span-4 text-right">Role</div>
        </div>

        {/* List Items */}
        {users?.map((user: any) => (
          <div key={user.id} className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b border-gray-100 dark:border-primary/10 hover:bg-background-light dark:hover:bg-primary/5 transition-colors items-center">
            {/* User Details */}
            <div className="col-span-12 md:col-span-4 flex gap-4 items-center">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-bold text-nordic dark:text-white truncate">{user.email}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">{user.id}</p>
              </div>
            </div>
            
            {/* Date Joined */}
            <div className="col-span-6 md:col-span-4">
              <div className="text-sm text-nordic dark:text-gray-300">
                {new Date(user.created_at).toLocaleDateString()}
              </div>
            </div>
            
            {/* Role / Actions */}
            <div className="col-span-6 md:col-span-4 flex items-center justify-end gap-2">
              <div className="w-40">
                <UserRoleSelect userId={user.id} initialRole={user.role} />
              </div>
            </div>
          </div>
        ))}
        
        {(!users || users.length === 0) && (
           <div className="p-8 text-center text-gray-500">No users found.</div>
        )}
      </div>
    </>
  );
}
