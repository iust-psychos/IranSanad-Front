import { Menu } from "@base-ui-components/react/menu";
import { DEFAULT_IMAGE } from "@/Constants/ImageConstants";
import { IconUserProfileClose } from "./Icons";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { userInfoLoader } from "@/managers/UserDashboardManager";
import CookieManager from "@/managers/CookieManager";
import { RingLoader } from "react-spinners";
import constants from "@/managers/Constants";
import { baseAPI } from "@/Managers/NavbarManager";

export default function UserProfileDropdown({ profile_image }) {
  const navigate = useNavigate();
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

  const handleSignOut = () => {
    CookieManager.RemoveToken();
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <Menu.Root modal={false} onOpenChange={(open) => open && refetch()}>
      <Menu.Trigger className="menu-profile">
        <img
          src={profile_image ? baseAPI + profile_image : DEFAULT_IMAGE}
          alt="عکس پروفایل"
          className="menu-profile-image"
        />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={6} align="end">
          <Menu.Popup className="user-dashboard-dropdown profile-dropdown">
            {isLoading ? (
              <RingLoader color="gold" size="1.5rem" data-testid="spinner" />
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
                    src={`${baseAPI + profile_image}` || DEFAULT_IMAGE}
                    alt="عکس پروفایل"
                  />
                </menu>
                <section className="user-dashboard-dropdown profile-dropdown-info">
                  <p>
                    {userInfo.first_name || "بدون نام"}{" "}
                    {userInfo.last_name || ""}
                  </p>
                  <p style={{ fontFamily: "monospace", fontSize: "14px" }}>
                    {userInfo.email}
                  </p>
                </section>
                <menu className="user-dashboard-dropdown profile-dropdown-buttons">
                  <Link to="/profile" discover="none">
                    <button>تغییر مشخصات کاربری</button>
                  </Link>
                  <Link to="/dashboard" discover="none">
                    <button>داشبورد کاربر</button>
                  </Link>
                  <button onClick={handleSignOut}>خروج از حساب</button>
                </menu>
              </>
            ) : null}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
