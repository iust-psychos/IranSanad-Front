import React, { useState, useRef } from "react";
import "./user-dashboard.css";
import { initialDocuments } from "../../Managers/user-dashboard-manager.js";
import { IconLogo, IconPlus, IconSearch, IconPlusFill } from "./Icons.jsx";
import DocumentOptionsDropdown from "./DocumentOptionsDropdown.jsx";
import DocumentSortByDropdown from "./DocumentSortByDropdown.jsx";
import UserProfileDropdown from "./UserProfileDropdown.jsx";
import { toPersianDigits } from "../../Scripts/persian-number-converter.js";
import { useLoaderData } from "react-router-dom";

export default function UserDashboard() {
  const searchRef = useRef();
  const [sortField, setSortField] = useState("last_seen_time");
  const fetchedDocuments = useLoaderData();
  const [documents, setDocuments] = useState(fetchedDocuments);

  const handleSearch = () => {
    const searchValue = searchRef.current.value;
    setDocuments(
      initialDocuments.filter((doc) =>
        doc.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="user-dashboard">
      <menu className="navbar">
        <button className="menu-logo">
          <IconLogo />
        </button>
        <UserProfileDropdown />
      </menu>
      <menu className="utility">
        <div className="menu-search">
          <button onClick={handleSearch}>
            <IconSearch />
          </button>
          <input
            type="text"
            placeholder="جست و جو"
            ref={searchRef}
            onKeyDown={handleKeyDown}
          />
        </div>
        <DocumentSortByDropdown updateStateFunction={setSortField} />
        <button className="menu-button menu-create">
          <IconPlusFill />
          <p>ایجاد یک سند جدید</p>
        </button>
      </menu>

      {documents.length === 0 ? (
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
                {sortField === "last_modified_time"
                  ? "زمان آخرین تغییر"
                  : sortField === "last_seen_time"
                  ? "زمان آخرین بازدید"
                  : ""}
              </th>
              <th>
                <IconPlus />
              </th>
            </tr>
          </thead>
          <tbody>
            {documents
              .sort((doc) => doc[sortField])
              .reverse()
              .map((doc, index) => (
                <tr key={doc.id}>
                  <td>{toPersianDigits(doc.name)}</td>
                  <td>{doc.owner}</td>
                  <td>{toPersianDigits(doc[sortField])}</td>
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
