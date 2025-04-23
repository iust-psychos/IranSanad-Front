import { Menu } from "@base-ui-components/react/menu";
import DEFAULT_IMAGE from "../../../src/Images/UserProfile/Default.png";
import { IconUserProfileClose } from "./Icons";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { userInfoLoader } from "../../../Managers/user-dashboard-manager";

export default function UserProfileDropdown() {
  const {
    data: userInfo,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["user-info"],
    queryFn: userInfoLoader,
    enabled: false,
  });

  return (
    <Menu.Root modal={false} onOpenChange={(open) => open && refetch()}>
      <Menu.Trigger className="menu-profile">
        <img src={DEFAULT_IMAGE} alt="عکس پروفایل" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={6} align="end">
          <Menu.Popup className="user-dashboard-dropdown profile-dropdown">
            {isLoading ? (
              <div className="p-4">در حال بارگذاری...</div>
            ) : isError ? (
              <div className="p-4 text-red-600">خطا در دریافت اطلاعات</div>
            ) : userInfo ? (
              <>
                <menu className="user-dashboard-dropdown profile-dropdown-grid">
                  <Menu.Item
                    className="user-dashboard-dropdown profile-dropdown-close"
                    closeOnClick
                  >
                    <button>
                      <IconUserProfileClose />
                    </button>
                  </Menu.Item>
                  <img
                    src={userInfo.profile_image || DEFAULT_IMAGE}
                    alt="عکس پروفایل"
                  />
                </menu>
                <section className="user-dashboard-dropdown profile-dropdown-info">
                  <p>
                    {userInfo.first_name || "بدون نام"}{" "}
                    {userInfo.last_name || ""}
                  </p>
                  <p>{userInfo.email}</p>
                </section>
                <menu className="user-dashboard-dropdown profile-dropdown-buttons">
                  <Link to="/profile">
                    <button>تغییر مشخصات کاربری</button>
                  </Link>
                  <Link to="/dashboard">
                    <button>داشبورد کاربر</button>
                  </Link>
                  <button>خروج از حساب</button>
                </menu>
              </>
            ) : null}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
