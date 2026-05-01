"use client";

import { useState } from "react";
import { updateUserRole } from "../actions";

export default function UserRoleSelect({ userId, initialRole }: { userId: string, initialRole: string }) {
  const [role, setRole] = useState(initialRole);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setRole(newRole);
    setIsLoading(true);

    const result = await updateUserRole(userId, newRole);
    
    if (!result.success) {
      alert("Failed to update user role: " + result.error);
      setRole(initialRole); // revert
    }
    
    setIsLoading(false);
  };

  return (
    <select
      value={role}
      onChange={handleChange}
      disabled={isLoading}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-50"
    >
      <option value="user">User</option>
      <option value="agent">Agent</option>
      <option value="admin">Admin</option>
    </select>
  );
}
