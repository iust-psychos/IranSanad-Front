import { useEffect, useState } from "react";
import "./Notify.css";
import { Dialog } from "@base-ui-components/react/dialog";
import SelectBox from "./SelectBox";
import axios from "axios";
import { showErrorToast, showSuccessToast } from "@/utils/toast.js";
import {
  postPermissionsAPI,
  getPermissionsAPI,
  checkValidUserAPI,
  token,
} from "@/managers/ShareManager.js";

const Notify = ({ doc, users, onClose, permissionList, setPermissionList }) => {
  const [document, setDocument] = useState(doc);
  const [list, setList] = useState([]);

  const isUserAlreadyAdded = (email) => {
    return permissionList?.some(
      (permission) =>
        permission.user.email?.toLowerCase() === email.toLowerCase() ||
        permission.user.username?.toLowerCase() === email.toLowerCase()
    );
  };

  useEffect(() => {
    const handleUsers = (usersList) => {
      const uniqueUsers = new Set();
      return usersList
        .replace(/\s+/g, "")
        .split(",")
        .filter((user) => {
          const trimmed = user.trim();
          const isDuplicateInInput = uniqueUsers.has(trimmed.toLowerCase());
          const isDuplicateInPermissions = isUserAlreadyAdded(trimmed);

          if (isDuplicateInPermissions) {
            showErrorToast(`کاربر ${trimmed} قبلاً اضافه شده است`);
            onClose();
            return false;
          }

          return (
            trimmed !== "" &&
            !isDuplicateInInput &&
            uniqueUsers.add(trimmed.toLowerCase())
          );
        })
        .map((user) => ({
          email: user.trim(),
          permission: "ReadOnly",
        }));
    };
    setList(handleUsers(users));
  }, [users, permissionList]);

  useEffect(() => {
    const doSetDoc = () => {
      setDocument(doc);
    };
    doSetDoc();
  }, [doc]);

  const [notifyValue, setNotifyValue] = useState(false);
  const [textValue, setTextValue] = useState("ایران سند");

  const handleChangeNotify = (e) => {
    setNotifyValue(e.target.checked);
  };

  const handleChangeText = (e) => {
    setTextValue(e.target.value);
  };

  const handleChangePermission = (email, newPermission) => {
    setList((prevList) =>
      prevList.map((user) =>
        user.email === email ? { ...user, permission: newPermission } : user
      )
    );
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddUser = async (event) => {
    event.preventDefault();

    const duplicateUsers = list.filter((user) =>
      isUserAlreadyAdded(user.email)
    );
    if (duplicateUsers.length > 0) {
      showErrorToast(
        `این کاربران قبلاً اضافه شده‌اند: ${duplicateUsers
          .map((u) => u.email)
          .join(", ")}`
      );
      onClose();
      return;
    }

    try {
      const results = await Promise.all(
        list.map(async (user) => {
          const body = isEmailValid(user.email)
            ? { email: user.email }
            : { username: user.email };

          const checkUserResponse = await axios.post(checkValidUserAPI, body, {
            headers: {
              Authorization: `JWT ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (checkUserResponse.data) {
            await axios.post(
              postPermissionsAPI,
              {
                document: document.id,
                permissions: [
                  {
                    user: checkUserResponse.data.user_id,
                    permission: user.permission,
                  },
                ],
                send_email: notifyValue,
                email_message: textValue,
              },
              {
                headers: {
                  Authorization: `JWT ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            return { success: true, email: user.email };
          }
          return { success: false, email: user.email };
        })
      );

      const updatedPermissions = await axios.get(
        `${getPermissionsAPI}${document.id}/`,
        {
          headers: {
            Authorization: `JWT ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("inital: ", permissionList);
      console.log("calculated: ", updatedPermissions.data);
      setPermissionList(updatedPermissions.data);
      console.log("final: ", permissionList);

      const failedUsers = results.filter((result) => !result.success);
      if (failedUsers.length > 0) {
        showErrorToast(
          `خطا در اضافه کردن کاربر: ${failedUsers
            .map((u) => u.email)
            .join(", ")}`
        );
      } else {
        showSuccessToast("دسترسی کاربران با موفقیت اضافه شد");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("خطا در اضافه کردن کاربران");
    } finally {
      onClose();
    }
  };

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Portal>
        <Dialog.Popup>
          <form className="notify">
            <div className="notify-title">هم‌رسانی سند</div>
            <div className="notify-body">
              <div className="notify-body-items">
                {list &&
                  list.map((user) => (
                    <div key={user.email} className="notify-body-item">
                      <input
                        type="text"
                        value={user.email}
                        className="notify-body-item-user"
                      />
                      <SelectBox
                        className="notify-body-item-permission"
                        userAccessLevel={user.permission}
                        setUserAccessLevel={(permission) =>
                          handleChangePermission(user.email, permission)
                        }
                        mode="3"
                      />
                    </div>
                  ))}
              </div>
              <div className="notify-body-checkbox">
                <input
                  type="checkbox"
                  id="notify"
                  name="notify"
                  checked={notifyValue}
                  onChange={handleChangeNotify}
                  className="notify-body-checkbox-select"
                ></input>
                <label htmlFor="notify" className="notify-body-checkbox-label">
                  به افراد اطلاع داده شود
                </label>
              </div>
              {notifyValue && (
                <textarea
                  name="emailText"
                  id="emailText"
                  cols="30"
                  rows="5"
                  placeholder="متن ایمیل ارسالی را مشخص کنید..."
                  className="notify-body-text"
                  onChange={handleChangeText}
                ></textarea>
              )}
            </div>
            <div className="notify-bottom">
              <button className="notify-button notify-cancel" onClick={onClose}>
                لغو
              </button>
              <button
                className="notify-button notify-confirm"
                onClick={handleAddUser}
              >
                تایید
              </button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Notify;
