import { useEffect, useState } from "react";
import "@/styles/Notify.css";
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

const Notify = ({ doc, users, onClose, setPermissionList }) => {
  const [list, setList] = useState(null);
  const [document, setDocument] = useState(doc);

  useEffect(() => {
    const handleUsers = (usersList) => {
      return usersList.replace(/\s+/g, "").split(",");
    };
    setList(handleUsers(users));
  }, [users]);

  useEffect(() => {
    const doSetDoc = () => {
      setDocument(doc);
    };
    doSetDoc();
  }, [doc]);

  const [notifyValue, setNotifyValue] = useState(false);
  const [textValue, setTextValue] = useState("");

  const handleChangeNotify = (e) => {
    setNotifyValue(e.target.checked);
  };

  const handleChangeText = (e) => {
    setTextValue(e.target.value);
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddUser = async (event) => {
    event.preventDefault();

    for (let user of list) {
      const body = isEmailValid(user.trim())
        ? {
            email: user.trim(),
          }
        : {
            username: user.trim(),
          };

      try {
        const checkUserResponse = await axios.post(checkValidUserAPI, body, {
          headers: {
            Authorization: `JWT ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("checkUserResponse: ", checkUserResponse);

        if (checkUserResponse.data) {
          const permissionResponse = await axios.post(
            postPermissionsAPI,
            {
              document: document.id,
              permissions: [
                {
                  user: checkUserResponse.data.user_id,
                  permission: "ReadOnly",
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

          const updatedPermissions = await axios.get(
            `${getPermissionsAPI}${document.id}/`,
            {
              headers: {
                Authorization: `JWT ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          setPermissionList(updatedPermissions.data);
          showSuccessToast("دسترسی کاربر با موفقیت اضافه شد");
        }
      } catch (error) {
        console.log(error);
        showErrorToast("خطا در اضافه کردن کاربر");
      }
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
                  list.map((item) => (
                    <div key={item} className="notify-body-item">
                      <input
                        type="text"
                        value={item}
                        className="notify-body-item-user"
                      />
                      <SelectBox className="notify-body-item-permission" />
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
