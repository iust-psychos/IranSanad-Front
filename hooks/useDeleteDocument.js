import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteDocument } from "../Managers/user-dashboard-manager";

export function useDeleteDocument(updateStateFunction, document) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteDocument(document.doc_uuid),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["documents"] });
      updateStateFunction((prev) => prev.filter((d) => d.id !== document.id));
      const toastId = toast.loading("در حال حذف سند...");
      return { toastId };
    },

    onSuccess: (_, __, context) => {
      updateToast(context.toastId, "سند با موفقیت حذف شد", "success");
    },

    onError: (err, _, context) => {
      updateStateFunction((prev) => [...prev, document]);
      updateToast(context.toastId, "خطا در حذف سند", "error");
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
