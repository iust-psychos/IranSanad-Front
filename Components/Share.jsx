import React, { useEffect } from "react";
import { useState } from "react";
import "../Styles/Share.css";
import { GrAttachment } from "react-icons/gr";
import { FaUser } from "react-icons/fa";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { AiOutlineGlobal } from "react-icons/ai";
import { Select } from "@base-ui-components/react/select";
import { HiChevronUpDown } from "react-icons/hi2";
import { FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import CookieManager from "../Managers/CookieManager";
import { showErrorToast, showSuccessToast } from "../Utilities/Toast.js";

const baseAPI = "http://iransanad.fiust.ir";
const postPermissionsAPI =
  "http://iransanad.fiust.ir/api/v1/docs/permission/set_permission/";
const getPermissionsAPI =
  "http://iransanad.fiust.ir/api/v1/docs/permission/get_permission_list/";
const checkValidUserAPI = "http://iransanad.fiust.ir/api/v1/auth/user_lookup/";
const getDocAPI = "http://iransanad.fiust.ir/api/v1/docs/";

const Share = ({ onClose, doc_uuid }) => {
  const token = CookieManager.LoadToken();

  const [isLoading, setIsLoading] = useState(false);

  // Document
  const [document, setDocument] = useState({});

  // Permission
  const [permissionList, setPermissionList] = useState([]);

  useEffect(() => {
    const fetchDocumentAndPermission = async () => {
      setIsLoading(true);
      try {
        const docResponse = await axios.get(`${getDocAPI}${doc_uuid}/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
        });
        setDocument(docResponse.data);
        console.log("document: ", docResponse);

        const permissionResponse = await axios.get(
          `${getPermissionsAPI}${docResponse.data.id}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${token}`,
            },
          }
        );
        setPermissionList(permissionResponse.data);
        console.log("permission: ", permissionResponse);
      } catch (error) {
        console.log(error);
        showErrorToast("امکان اشتراک گذاری سند فراهم نیست!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentAndPermission();
  }, [doc_uuid, token]);

  const [modifiedPermissionList, setModifiedPermissionList] = useState({});

  const handlePermissionChange = (userId, newPermission) => {
    setModifiedPermissionList((prev) => ({
      ...prev,
      [userId]: newPermission,
    }));

    console.log(newPermission);
  };

  // Search
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChangeSearch = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSubmitSearch = async (event) => {
    event.preventDefault();
    if (!searchInput.trim()) {
      return;
    }

    setIsSearching(true);

    const body = isEmailValid(searchInput.trim())
      ? {
          email: searchInput.trim(),
        }
      : {
          username: searchInput.trim(),
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
        setSearchInput("");
        toast.success("دسترسی کاربر با موفقیت اضافه شد");
      }
    } catch (error) {
      console.log(error);
      toast.error("خطا در اضافه کردن کاربر");
    } finally {
      setIsSearching(false);
    }
  };

  const [documentAccessLevel, setDocumentAccessLevel] = useState(
    document.is_public ? "public" : "restricted"
  );
  const [userAccessLevel, setUserAccessLevel] = useState("view");

  const generalDescriptionText =
    documentAccessLevel === "public"
      ? userAccessLevel === "view"
        ? "همه مجاز به مشاهده سند با پیوند"
        : "همه مجاز به ویرایش سند با پیوند"
      : userAccessLevel === "view"
      ? "تنها افراد فوق مجاز به دسترسی به سند با پیوند"
      : "تنها افراد فوق مجاز به دسترسی به سند با پیوند";

  const handleSubmit = async () => {
    try {
      const body = Object.entries(modifiedPermissionList).map(
        ([userId, permission]) => ({
          user: parseInt(userId),
          permission: permission,
        })
      );

      if (body.length > 0) {
        await axios.post(
          postPermissionsAPI,
          {
            document: document.id,
            permissions: body,
          },
          {
            headers: {
              Authorization: `JWT ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        showSuccessToast("تغییرات با موفقیت اعمال شد!");
      }
    } catch (error) {
      console.log(error);
      showErrorToast("خطا در اعمال تغییرات!");
    } finally {
      onClose();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(document.link)
      .then(() => {
        toast.success("پیوند سند رونوشت شد!", {
          autoClose: 1000,
        });
      })
      .catch((err) => {
        toast.error("خطا در رونوشت پیوند!", {
          autoClose: 1000,
        });
      });
  };

  // Close on ESCAPE
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <>
      {isLoading && <div> در حال بارگذاری ... </div>}
      <div className="share">
        <div className="share-area">
          <div className="share-area-title">
            اشتراک گذاری "{document.title}"
          </div>
          <div className="share-area-search">
            <form
              className="share-area-search-input"
              onSubmit={handleSubmitSearch}
            >
              <input
                type="search"
                placeholder="نام کاربری یا ایمیل افراد را وارد کنید"
                value={searchInput}
                onChange={handleChangeSearch}
                disabled={isSearching}
              />
              {isSearching && <span>در حال جستجو...</span>}
            </form>
          </div>
          <div className="share-access-list">
            <h1 className="share-access-title">افراد دارای دسترسی</h1>
            <div className="share-access-list-items">
              {permissionList.map((permissionItem) => (
                <div
                  className="share-access-list-item"
                  key={permissionItem.user.email}
                >
                  <div className="share-item-user">
                    <div className="share-item-icon">
                      {permissionItem.user.profile_image ? (
                        <img
                          src={baseAPI + permissionItem.user.profile_image}
                          alt="user profile image"
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        <FaUser fill="black" />
                      )}
                    </div>
                    <div className="share-item-name-email">
                      <h2 className="share-item-name">
                        {permissionItem.user.username}
                      </h2>
                      <p className="share-item-email">
                        {permissionItem.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="share-item-status">
                    {permissionItem.access_level === "Owner" ? (
                      <>
                        <p
                          className="share-item-status-label"
                          style={{ color: "gray" }}
                        >
                          مالک
                        </p>
                        <TbTriangleInvertedFilled
                          className="share-item-status-tri"
                          style={{ display: "none" }}
                        />
                      </>
                    ) : (
                      <>
                        <Select.Root
                          defaultValue={permissionItem.access_level}
                          onValueChange={(value) =>
                            handlePermissionChange(
                              permissionItem.user.id,
                              value
                            )
                          }
                        >
                          <Select.Trigger className="share-select-trigger">
                            <Select.Value
                              placeholder={
                                permissionItem.access_level === "ReadOnly"
                                  ? "نظاره‌گر"
                                  : "ویراستار"
                              }
                              className="share-item-status-label"
                            />
                            <HiChevronUpDown className="share-select-icon" />
                          </Select.Trigger>
                          <Select.Portal container={document.body}>
                            <Select.Backdrop />
                            <Select.Positioner>
                              <Select.Popup className="share-select-popup">
                                <Select.Item
                                  value="ReadOnly"
                                  className="share-select-item"
                                >
                                  <Select.ItemText>نظاره‌گر</Select.ItemText>
                                  <Select.ItemIndicator className="share-item-indicator">
                                    <FaCheck size={12} />
                                  </Select.ItemIndicator>
                                </Select.Item>
                                <Select.Item
                                  value="Write"
                                  className="share-select-item"
                                >
                                  <Select.ItemText>ویراستار</Select.ItemText>
                                  <Select.ItemIndicator className="share-item-indicator">
                                    <FaCheck size={12} />
                                  </Select.ItemIndicator>
                                </Select.Item>
                              </Select.Popup>
                            </Select.Positioner>
                          </Select.Portal>
                        </Select.Root>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="share-bottom">
            <div className="share-access-general">
              <h1 className="share-access-title">دسترسی عمومی</h1>
              <div className="share-access-general-item">
                <div className="share-item-user" style={{ cursor: "default" }}>
                  <div className="share-item-icon">
                    <AiOutlineGlobal fill="black" />
                  </div>
                  <div className="share-item-general-title-desc">
                    <div className="share-item-title-status">
                      <Select.Root
                        value={documentAccessLevel}
                        onValueChange={setDocumentAccessLevel}
                      >
                        <Select.Trigger className="share-select-trigger">
                          <Select.Value
                            placeholder={
                              documentAccessLevel === "public"
                                ? "همگانی"
                                : "محدود"
                            }
                            className="share-item-title"
                          />
                          <TbTriangleInvertedFilled
                            className="share-item-status-tri"
                            fill="black"
                          />
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Backdrop />
                          <Select.Positioner>
                            <Select.Popup className="share-select-popup">
                              <Select.Item
                                value="public"
                                className="share-item-title general"
                                style={{ cursor: "pointer" }}
                              >
                                <Select.ItemText>همگانی</Select.ItemText>
                                <Select.ItemIndicator className="share-item-indicator">
                                  <FaCheck size={12} />
                                </Select.ItemIndicator>
                              </Select.Item>
                              <Select.Item
                                value="restricted"
                                className="share-item-title general"
                                style={{ cursor: "pointer" }}
                              >
                                <Select.ItemText>محدود</Select.ItemText>
                                <Select.ItemIndicator className="share-item-indicator">
                                  <FaCheck size={12} />
                                </Select.ItemIndicator>
                              </Select.Item>
                            </Select.Popup>
                          </Select.Positioner>
                        </Select.Portal>
                      </Select.Root>
                    </div>
                    <p className="share-item-desc">{generalDescriptionText}</p>
                  </div>
                </div>
                {documentAccessLevel === "public" && (
                  <div className="share-item-status">
                    <Select.Root
                      value={userAccessLevel}
                      onValueChange={setUserAccessLevel}
                    >
                      <Select.Trigger className="share-select-trigger">
                        <Select.Value
                          placeholder={
                            userAccessLevel === "view" ? "مشاهده" : "ویرایش"
                          }
                          className="share-item-status-label"
                        />
                        <HiChevronUpDown className="share-select-icon" />
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Backdrop />
                        <Select.Positioner>
                          <Select.Popup className="share-select-popup">
                            <Select.Item
                              value="view"
                              className="share-select-item"
                            >
                              <Select.ItemText>مشاهده</Select.ItemText>
                              <Select.ItemIndicator className="share-item-indicator">
                                <FaCheck size={12} />
                              </Select.ItemIndicator>
                            </Select.Item>
                            <Select.Item
                              value="edit"
                              className="share-select-item"
                            >
                              <Select.ItemText>ویرایش</Select.ItemText>
                              <Select.ItemIndicator className="share-item-indicator">
                                <FaCheck size={12} />
                              </Select.ItemIndicator>
                            </Select.Item>
                          </Select.Popup>
                        </Select.Positioner>
                      </Select.Portal>
                    </Select.Root>
                  </div>
                )}
              </div>
            </div>
            <div className="share-area-buttons">
              <button
                type="button"
                className="share-btn copy-button"
                onClick={handleCopyLink}
              >
                <GrAttachment fill="black" />
                رونویس پیوند
              </button>
              <button
                type="submit"
                className="share-btn confirm-button"
                onClick={handleSubmit}
              >
                تایید
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Share;
