"use client";

import { useState } from "react";
import deleteAction from "./delete-action";

export default function Delete({ file }: { file: string }) {
  const [loading, setLoading] = useState(false);

  async function deleteFile() {
    if (loading) {
      return;
    }
    setLoading(true);

    const r = await deleteAction(file);
    if (!r.success) {
      alert(r.message);
    }

    setLoading(false);
  }

  return (
    <button
      title="Delete"
      className="bg-red-600 hover:bg-red-800 transition ease-out duration-300 text-white rounded-full size-7 shadow flex justify-center items-center"
      onClick={deleteFile}
    >
      {loading ? (
        <div className="size-5 bg-gray-400 animate-pulse rounded-full" />
      ) : (
        <i className="fas fa-trash" />
      )}
    </button>
  );
}
