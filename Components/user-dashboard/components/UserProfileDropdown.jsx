import { Menu } from "@base-ui-components/react/menu";
import DEFAULT_IMAGE from "@/src/Images/UserProfile/Default.png";
import { IconUserProfileClose } from "./Icons";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { userInfoLoader } from "@/Managers/user-dashboard-manager";
import CookieManager from "@/Managers/CookieManager";
import { RingLoader } from "react-spinners";
import constants from "../../../Managers/constants";

export default function UserProfileDropdown() {
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
        <img src={DEFAULT_IMAGE} alt="عکس پروفایل" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={6} align="end">
          <Menu.Popup className="user-dashboard-dropdown profile-dropdown">
            {isLoading ? (
              <RingLoader color="#bba1ea" size="1.5rem" data-testid="spinner" />
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
                    src={
                      `${constants.baseDomain}${userInfo.profile_image}` ||
                      DEFAULT_IMAGE
                    }
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
