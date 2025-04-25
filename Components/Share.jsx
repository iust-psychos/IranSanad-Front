import React from "react";
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

const postPermissionsAPI =
  "http://iransanad.fiust.ir/api/v1/docs/permission/permission/";

const Share = ({ onClose }) => {
  const users = [
    {
      name: "کاربر اول",
      email: "email1@example.com",
      img: "",
      access: "owner",
    },
    {
      name: "کاربر دوم",
      email: "email2@example.com",
      img: "",
      access: "editor",
    },
    {
      name: "کاربر سوم",
      email: "email3@example.com",
      img: "",
      access: "visitor",
    },
    {
      name: "کاربر چهارم",
      email: "email4@example.com",
      img: "",
      access: "visitor",
    },
    {
      name: "کاربر پنجم",
      email: "email5@example.com",
      img: "",
      access: "editor",
    },
  ];

  const [documentAccessLevel, setDocumentAccessLevel] = useState("restricted");
  const [userAccessLevel, setUserAccessLevel] = useState("view");

  const generalDescriptionText =
    documentAccessLevel === "public"
      ? userAccessLevel === "view"
        ? "همه مجاز به مشاهده سند با پیوند"
        : "همه مجاز به ویرایش سند با پیوند"
      : userAccessLevel === "view"
      ? "تنها افراد فوق مجاز به دسترسی به سند با پیوند"
      : "تنها افراد فوق مجاز به دسترسی به سند با پیوند";

  const documentLink = "this is a sample link!";

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(documentLink)
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

  return (
    <div className="share">
      <div className="share-area">
        <div className="share-area-title">اشتراک گذاری "نام فایل"</div>
        <div className="share-area-search">
          <div className="share-area-search-input">
            <input
              type="search"
              placeholder="نام کاربری یا ایمیل افراد را وارد کنید"
            />
          </div>
        </div>
        <div className="share-access-list">
          <h1 className="share-access-title">افراد دارای دسترسی</h1>
          <div className="share-access-list-items">
            {users.map((user) => (
              <div className="share-access-list-item" key={user.email}>
                <div className="share-item-user">
                  <div className="share-item-icon">
                    {!user.img && <FaUser fill="black" />}
                  </div>
                  <div className="share-item-name-email">
                    <h2 className="share-item-name">{user.name}</h2>
                    <p className="share-item-email">{user.email}</p>
                  </div>
                </div>
                <div className="share-item-status">
                  {user.access === "owner" ? (
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
                      <div onClick={(e) => e.stopPropagation()}>
                        <Select.Root defaultValue={user.access}>
                          <Select.Trigger className="share-select-trigger">
                            <Select.Value
                              placeholder={
                                user.access === "visitor"
                                  ? "نظاره‌گر"
                                  : "ویراستار"
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
                                  value="visitor"
                                  className="share-select-item"
                                >
                                  <Select.ItemText>نظاره‌گر</Select.ItemText>
                                  <Select.ItemIndicator className="share-item-indicator">
                                    <FaCheck size={12} />
                                  </Select.ItemIndicator>
                                </Select.Item>
                                <Select.Item
                                  value="editor"
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
                      </div>
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
              onClick={onClose}
            >
              تایید
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
