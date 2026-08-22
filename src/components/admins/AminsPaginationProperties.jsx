"use client";
import React, {useEffect, useState} from "react";

const AdminsPaginationProperties = ({
  localStorageName: localStorageNameAdd,
  setOpenFilter,
  setPage,
  setQueryParams,
}) => {
  const localStorageName = localStorageNameAdd + "Add";
  const [sortByValue, setSortByValue] = useState("");
  const [orderValue, setOrderValue] = useState("");

  const [openSortBy, setOpenSortBy] = useState(false);
  const [openOrder, setOpenOrder] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLimit = localStorage.getItem(localStorageName);
      if (savedLimit) {
        const parsed = JSON.parse(savedLimit);
        setSortByValue(parsed?.sortBy || "");
        setOrderValue(parsed?.order || "");
      }
    }
  }, [localStorageName]);
  useEffect(() => {
    setOpenSortBy(false);
  }, [sortByValue]);
  useEffect(() => {
    setOpenOrder(false);
  }, [orderValue]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const filterData = {
      sortBy: sortByValue,
      order: orderValue,
    };

    localStorage.setItem(localStorageName, JSON.stringify(filterData));
    setPage(1);
    const newFilterStr = `${sortByValue ? `&sortBy=${sortByValue}` : ""}${orderValue ? `&order=${orderValue}` : ""}`;
    setQueryParams((prev) => {
      const resetPaginationStr = prev.paginationStr.replace(
        /page=\d+/,
        "page=1",
      );
      return {
        paginationStr: resetPaginationStr,
        filterStr: newFilterStr,
      };
    });

    setOpenFilter(false);
  };

  return (
    <form
      onSubmit={handleFilterSubmit}
      className="products__b-pag-limits products__b-pag-limits-filter products__b-pag-lfilter-wrap"
    >
      <span
        onClick={() => setOpenFilter(false)}
        className="products__b-pag-span products__b-pag-span-close"
      >
        <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path>
        </svg>
      </span>
      <span className="products__b-pag-lselect products__b-pag-filter-lselect">
        <span>Sort by:</span>
        <span className="products__b-pag-filter-select">
          <span
            onClick={() => setOpenSortBy(!openSortBy)}
            className="products__b-pag-filter-choosed"
          >
            {sortByValue || "--"}
            <span className="products__b-pag-span">
              <svg
                xmlns="http://w3.org"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 14L8 10H16L12 14Z"></path>
              </svg>
            </span>
          </span>
          {openSortBy && (
            <span className="products__b-pag-filter-options">
              <span
                onClick={() => setSortByValue("id")}
                className="products__b-pag-filter-option"
              >
                id
              </span>
              <span
                onClick={() => setSortByValue("login")}
                className="products__b-pag-filter-option"
              >
                login
              </span>
              <span
                onClick={() => setSortByValue("fullName")}
                className="products__b-pag-filter-option"
              >
                fullname
              </span>
              <span
                onClick={() => setSortByValue("createdAt")}
                className="products__b-pag-filter-option"
              >
                created at
              </span>
              <span
                onClick={() => setSortByValue("")}
                className="products__b-pag-filter-option"
              >
                --
              </span>
            </span>
          )}
        </span>
      </span>
      <span className="products__b-pag-lselect products__b-pag-filter-lselect">
        <span>Order:</span>
        <span className="products__b-pag-filter-select">
          <span
            onClick={() => setOpenOrder(!openOrder)}
            className="products__b-pag-filter-choosed"
          >
            {orderValue || "--"}
            <span className="products__b-pag-span">
              <svg
                xmlns="http://w3.org"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 14L8 10H16L12 14Z"></path>
              </svg>
            </span>
          </span>
          {openOrder && (
            <span className="products__b-pag-filter-options">
              <span
                onClick={() => setOrderValue("ASC")}
                className="products__b-pag-filter-option"
              >
                ASC
              </span>
              <span
                onClick={() => setOrderValue("DESC")}
                className="products__b-pag-filter-option"
              >
                DESC
              </span>
              <span
                onClick={() => setOrderValue("")}
                className="products__b-pag-filter-option"
              >
                --
              </span>
            </span>
          )}
        </span>
      </span>
      <span className="products__b-pag-lselbutton-box products__b-pag-filter-lselect">
        <button type="submit" className="products__b-pag-lselect-button">
          Try
        </button>
      </span>
    </form>
  );
};

export default AdminsPaginationProperties;
