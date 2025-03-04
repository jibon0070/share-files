"use client";

import deleteAction from "./delete-action";
import { useMutation } from "@tanstack/react-query";

function useEngine(fileName: string) {
  const deleteMutation = useMutation({
    mutationFn: deleteAction,
    onSuccess: (r) => {
      if (!r.success) {
        alert(r.message);
      }
    },
  });

  async function deleteFile() {
    if (deleteMutation.isPending) {
      return;
    }

    deleteMutation.mutate(fileName);
  }

  return { deleteFile, loading: deleteMutation.isPending };
}

export default function Delete({ file }: { file: string }) {
  const { deleteFile, loading } = useEngine(file);
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
