import { useEffect, useState } from "react";
import "./index.css";
import { GrAttachment } from "react-icons/gr";
import { FaUser } from "react-icons/fa";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { AiOutlineGlobal } from "react-icons/ai";
import { Select } from "@base-ui-components/react/select";
import { FaCheck } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import axios from "axios";
import CookieManager from "@/managers/CookieManager";
import { showErrorToast, showSuccessToast } from "@/utils/toast.js";
import { Dialog } from "@base-ui-components/react/dialog";
import {
  baseAPI,
  postPermissionsAPI,
  getPermissionsAPI,
  getDocAPI,
} from "@/managers/ShareManager.js";
import Notify from "./Notify";
import SelectBox from "./SelectBox";

const Share = ({ onClose, doc_uuid }) => {
  const token = CookieManager.LoadToken();

  const [isLoading, setIsLoading] = useState(false);
  const [document, setDocument] = useState({});
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

  const [searchInput, setSearchInput] = useState("");

  const handleChangeSearch = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSubmitSearch = async (event) => {
    event.preventDefault();
    if (!searchInput.trim()) {
      return;
    }

    setShowNotify(true);
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

  const handleUserImageAddress = (imageUrl) => {
    return baseAPI.slice(0, -1) + imageUrl;
  };

  const [showNotify, setShowNotify] = useState(false);

  return (
    <>
      {isLoading && <div> در حال بارگذاری ... </div>}
      <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
        <Dialog.Backdrop />
        <Dialog.Portal>
          <Dialog.Popup className="share">
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
                    name="share-search-input"
                    id="share-search-input"
                    type="search"
                    placeholder="نام کاربری یا ایمیل افراد را وارد کنید"
                    value={searchInput}
                    onChange={handleChangeSearch}
                  />
                  <IoSearchSharp
                    name="share-search-button"
                    id="share-search-button"
                    onClick={handleSubmitSearch}
                  />
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
                              src={handleUserImageAddress(
                                permissionItem.user.profile_image
                              )}
                              alt={permissionItem.user.username}
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                              }}
                            />
                          ) : (
                            <FaUser data-testid="FaUser-icon" fill="black" />
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
                            <SelectBox
                              body={document.body}
                              permissionItem={permissionItem}
                              handlePermissionChange={handlePermissionChange}
                              mode={"1"}
                            />
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
                    <div
                      className="share-item-user"
                      style={{ cursor: "default" }}
                    >
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
                              <TbTriangleInvertedFilled className="share-item-status-tri" />
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
                        <p className="share-item-desc">
                          {generalDescriptionText}
                        </p>
                      </div>
                    </div>
                    {documentAccessLevel === "public" && (
                      <div className="share-item-status">
                        <SelectBox
                          mode="2"
                          userAccessLevel={userAccessLevel}
                          setUserAccessLevel={setUserAccessLevel}
                        />
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
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
      {showNotify && (
        <Notify
          doc={document}
          users={searchInput}
          onClose={() => setShowNotify(false)}
          permissionList={permissionList}
          setPermissionList={setPermissionList}
        />
      )}
    </>
  );
};

export default Share;
