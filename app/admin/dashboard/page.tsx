import Link from "next/link";
import PropertiesTab from "./components/PropertiesTab";
import UsersTab from "./components/UsersTab";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const tab = resolvedParams.tab === 'users' ? 'users' : 'properties';

  return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-nordic dark:text-white tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your properties portfolio and user roles.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/dashboard?tab=properties"
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-2 ${tab === 'properties' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white dark:bg-[#152e2a] border border-gray-200 dark:border-primary/30 text-nordic dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary/10'}`}
          >
            <span className="material-icons text-base">apartment</span> Properties
          </Link>
          <Link 
            href="/admin/dashboard?tab=users"
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-2 ${tab === 'users' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white dark:bg-[#152e2a] border border-gray-200 dark:border-primary/30 text-nordic dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary/10'}`}
          >
            <span className="material-icons text-base">people</span> Users
          </Link>
        </div>
      </div>

      {tab === "properties" ? <PropertiesTab /> : <UsersTab />}
    </main>
  );
}
