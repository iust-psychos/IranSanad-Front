import React, { useState, useRef } from "react";
import "../styles/user-dashboard.css";
import { IconLogo, IconPlus, IconSearch, IconPlusFill } from "./Icons.jsx";
import DocumentOptionsDropdown from "./DocumentOptionsDropdown.jsx";
import DocumentSortByDropdown from "./DocumentSortByDropdown.jsx";
import UserProfileDropdown from "./UserProfileDropdown.jsx";
import { toPersianDigit } from "../../../Scripts/persian-number-converter.js";
import { useLoaderData } from "react-router-dom";
import { toPersianDate } from "../../../Scripts/persian-date-converter.js";

export default function UserDashboard() {
  const searchRef = useRef();
  const [sortField, setSortField] = useState("updated_at");
  const fetchedDocuments = useLoaderData();
  const [documents, setDocuments] = useState(fetchedDocuments);

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
                  : sortField === "created_at"
                  ? "زمان ایجاد"
                  : ""}
              </th>
              <th>
                <IconPlus />
              </th>
            </tr>
          </thead>
          <tbody>
            {documents
              .sort((a, b) => new Date(a[sortField]) - new Date(b[sortField]))
              .reverse()
              .map((doc, index) => (
                <tr key={doc.id} onClick={() => alert("fuck")}>
                  <td>{toPersianDigit(doc.title)}</td>
                  <td>{toPersianDigit(doc.owner)}</td>
                  <td>{toPersianDate(doc[sortField])}</td>
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
