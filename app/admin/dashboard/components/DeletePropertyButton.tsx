"use client";

import { useState, useTransition } from "react";
import { deleteProperty } from "@/app/admin/properties/actions";
import { useRouter } from "next/navigation";

export default function DeletePropertyButton({ propertyId }: { propertyId: string }) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProperty(propertyId);
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
          onClick={handleDelete}
          disabled={isPending}
          className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 transition-colors font-medium disabled:opacity-60"
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
      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
      title="Delete Property"
    >
      <span className="material-icons text-xl">delete_outline</span>
    </button>
  );
}
