"use client";

import { useState, useTransition } from "react";
import { togglePropertyStatus } from "@/app/admin/properties/actions";
import { useRouter } from "next/navigation";

export default function DeletePropertyButton({ propertyId, isActive }: { propertyId: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await togglePropertyStatus(propertyId, !isActive);
      if (result?.success) {
        router.refresh();
      }
      setConfirming(false);
    });
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`px-2 py-1 text-xs rounded text-white transition-colors font-medium disabled:opacity-60 ${isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
        >
          {isPending ? "…" : "Yes"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors font-medium"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className={`p-2 rounded-lg transition-all ${isActive ? "text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" : "text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"}`}
      title={isActive ? "Deactivate Property" : "Activate Property"}
    >
      <span className="material-icons text-xl">{isActive ? "visibility_off" : "visibility"}</span>
    </button>
  );
}
