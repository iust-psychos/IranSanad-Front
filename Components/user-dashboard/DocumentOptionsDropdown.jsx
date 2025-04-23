import { IconVerticalOptions } from "./Icons.jsx";
import { Menu } from "@base-ui-components/react/menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteDocument } from "../../Managers/user-dashboard-manager.js";

export default function DocumentOptionsDropdown({
  document,
  updateStateFunction,
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteDocument(document.id),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["documents"] });

      updateStateFunction((prev) => prev.filter((d) => d.id !== document.id));

      toast.info("در حال حذف سند...");

      return { previousDocs: queryClient.getQueryData(["documents"]) };
    },

    onSuccess: () => {
      toast.success("سند با موفقیت حذف شد");
    },

    onError: (err, _, context) => {
      updateStateFunction((prev) => [...prev, document]); // Rollback
      toast.error("خطا در حذف سند");
      console.error(err);
    },
  });

  return (
    <Menu.Root openOnHover onClick={(e) => e.stopPropagation()}>
      <Menu.Trigger
        className="user-dashboard-dropdown dropdown-button"
        onClick={(e) => e.stopPropagation()}
      >
        <IconVerticalOptions />
      </Menu.Trigger>
      <Menu.Portal onClick={(e) => e.stopPropagation()}>
        <Menu.Positioner sideOffset={8} onClick={(e) => e.stopPropagation()}>
          <Menu.Popup
            className="user-dashboard-dropdown dropdown-menu"
            onClick={(e) => e.stopPropagation()}
          >
            <Menu.Item className="user-dashboard-dropdown dropdown-item">
              تغییر نام
            </Menu.Item>
            <Menu.Item
              className="user-dashboard-dropdown dropdown-item"
              onClick={() => mutation.mutate()}
            >
              حذف
            </Menu.Item>
            <Menu.Item className="user-dashboard-dropdown dropdown-item">
              باز کردن در برگه جدید
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
