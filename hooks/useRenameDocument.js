import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { renameDocument } from "../Managers/user-dashboard-manager";

export function useRenameDocument(updateStateFunction, document) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newName) => renameDocument(document.id, newName),

    onMutate: async (newName) => {
      await queryClient.cancelQueries({ queryKey: ["documents"] });

      const oldTitle = document.title;
      updateStateFunction((prev) =>
        prev.map((doc) =>
          doc.id === document.id ? { ...doc, title: newName } : doc
        )
      );
      const toastId = toast.loading("در حال تغییر نام سند...");
      return { toastId, oldTitle };
    },

    onSuccess: (_, __, context) => {
      updateToast(context.toastId, "نام سند با موفقیت تغییر یافت", "success");
    },

    onError: (err, _, context) => {
      updateStateFunction((prev) =>
        prev.map((doc) =>
          doc.id === document.id ? { ...doc, title: context.oldTitle } : doc
        )
      );
      updateToast(context.toastId, "خطا در تغییر نام سند", "error");
      console.error(err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

function updateToast(id, message, type) {
  toast.update(id, {
    render: message,
    type,
    isLoading: false,
    autoClose: 3000,
  });
}
