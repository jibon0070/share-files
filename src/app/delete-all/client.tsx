"use client";

import { useMutation } from "@tanstack/react-query";
import deleteAllAction from "./actions/delete-all.action";

function useEngine() {
  const deleteAllMutation = useMutation({
    mutationFn: deleteAllAction,
    onSuccess: (r) => {
      if (!r.success) {
        window.alert(r.message);
      }
    },
  });

  function deleteAll() {
    if (
      !window.confirm("Are you sure you want to delete all files?") ||
      deleteAllMutation.isPending
    ) {
      return;
    }

    deleteAllMutation.mutate();
  }

  return { deleteAll };
}

export default function DeleteAll() {
  const { deleteAll } = useEngine();

  return (
    <button
      onClick={deleteAll}
      className="bg-red-400 px-4 py-1 text-white rounded cursor-pointer"
    >
      Delete All
    </button>
  );
}
