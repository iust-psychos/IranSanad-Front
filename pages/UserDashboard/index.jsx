import React, { useState, useRef } from "react";
import "./index.css";
import { IconPlus, IconSearch, IconPlusFill } from "./Icons.jsx";
import DocumentOptionsDropdown from "./DocumentOptionsDropdown.jsx";
import DocumentSortByDropdown from "./DocumentSortByDropdown.jsx";
import UserProfileDropdown from "./UserProfileDropdown.jsx";
import { toPersianDigit } from "@/utils/PersianNumberConverter.js";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { toPersianDate } from "@/utils/PersianDateConverter.js";
import { createDocument } from "@/managers/UserDashboardManager.js";
import { useTheme } from "@/src/ThemeContext";
import logo_dark from "/images/logo_dark.png";
import logo_light from "/images/logo_light.png";

export default function UserDashboard() {
  const searchRef = useRef();
  const [sortField, setSortField] = useState("last_seen");
  const fetchedDocuments = useLoaderData();
  const [documents, setDocuments] = useState(fetchedDocuments);
  const navigate = useNavigate();

  const { isDarkMode } = useTheme();

  const handleSearch = () => {
    const searchValue = searchRef.current.value;
    setDocuments(
      fetchedDocuments.filter((doc) =>
        doc.title.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCreate = async () => {
    const { doc_uuid } = await createDocument();
    navigate(`/document/${doc_uuid}`);
  };

  const sortDocuments = (field) => {
    return (a, b) => {
      const dateA = a[field] ? new Date(a[field]) : null;
      const dateB = b[field] ? new Date(b[field]) : null;

      if (!dateA && !dateB) return 0;
      if (!dateA) return -1;
      if (!dateB) return 1;

      return dateA - dateB;
    };
  };

  return (
    <div className="user-dashboard">
      <menu className="navbar">
        <button className="menu-logo" onClick={() => navigate("/landing")}>
          <img
            style={{ width: "50px", height: "50px" }}
            src={isDarkMode ? logo_dark : logo_light}
            alt="لوگو ایران سند"
          />
        </button>
        <UserProfileDropdown data-testid="user-profile" />
      </menu>
      <menu className="utility">
        <div className="menu-search">
          <button onClick={handleSearch}>
            <IconSearch data-testid="icon-search" />
          </button>
          <input
            type="text"
            placeholder="جست و جو"
            ref={searchRef}
            onKeyDown={handleKeyDown}
          />
        </div>
        <DocumentSortByDropdown updateStateFunction={setSortField} />
        <button className="menu-button menu-create" onClick={handleCreate}>
          <IconPlusFill />
          <p>ایجاد یک سند جدید</p>
        </button>
      </menu>

      {documents === null || documents.length === 0 ? (
        <section className="not-found">
          <p>
            {`هیچ سندی ${searchRef.current?.value ? "با این مشخصات" : ""} برای
            شما یافت نشد`}
          </p>
        </section>
      ) : (
        <table>
          <thead>
            <tr>
              <th>نام سند</th>
              <th>مالک سند</th>
              <th>
                {sortField === "updated_at"
                  ? "زمان آخرین تغییر"
                  : sortField === "last_seen"
                  ? "زمان آخرین بازدید"
                  : ""}
              </th>
              <th>
                <IconPlus data-testid="icon-plus-fill" />
              </th>
            </tr>
          </thead>
          <tbody>
            {documents
              .sort(sortDocuments(sortField))
              .reverse()
              .map((doc) => (
                <tr
                  key={doc.doc_uuid}
                  onClick={() => navigate(`/document/${doc.doc_uuid}`)}
                >
                  <td>{toPersianDigit(doc.title)}</td>
                  <td>{doc.owner_name === "Me" ? "من" : "--"}</td>
                  <td>
                    {doc[sortField] ? toPersianDate(doc[sortField]) : "--"}
                  </td>
                  <td>
                    <DocumentOptionsDropdown
                      document={doc}
                      updateStateFunction={setDocuments}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
