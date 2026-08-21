import React, {useEffect, useState} from "react";

const CategoriesPaginationProperties = ({
  localStorageName: localStorageNameAdd,
  setSearchQuery,
  setOpenFilter,
  setPage
}) => {
  const [localStorageName, setLocalStorageName] = useState(
    localStorageNameAdd + "Add",
  );
  const [localLimit, setLocalLimit] = useState(() => {
    if (typeof window !== "undefined") {
      const savedLimit = localStorage.getItem(localStorageName);
      return savedLimit ? JSON.parse(savedLimit) : null;
    }
    return null;
  });

  const [limit, setLimit] = useState({
    isActive: localLimit?.isActive || "",
    sortBy: localLimit?.sortBy || "",
    order: localLimit?.order || "",
  });

  const [isActiveValue, setIsActiveValue] = useState("");
  const [openIsActive, setOpenIsActive] = useState(false);
  const [sortByValue, setSortByValue] = useState("");
  const [openSortBy, setOpenSortBy] = useState(false);
  const [orderValue, setOrderValue] = useState("");
  const [openOrder, setOpenOrder] = useState(false);

  useEffect(() => {
    if (localLimit) {
      setIsActiveValue(localLimit?.isActive);
      setSortByValue(localLimit?.sortBy);
      setOrderValue(localLimit?.order);
    }
  }, [localLimit]);

  useEffect(() => {
    setOpenIsActive(false);
  }, [isActiveValue]);

  useEffect(() => {
    setOpenSortBy(false);
  }, [sortByValue]);
  useEffect(() => {
    setOpenOrder(false);
  }, [orderValue]);

  const handleFilter = (e) => {
    e.preventDefault();
    const filterData = {
      isActive: isActiveValue,
      sortBy: sortByValue,
      order: orderValue,
    };

    localStorage.setItem(localStorageName, JSON.stringify(filterData));
    setLocalLimit(filterData);
    const queryStr = `${isActiveValue ? `isActive=${isActiveValue}` : ""}${sortByValue ? `&sortBy=${sortByValue}` : ""}${orderValue ? `&order=${orderValue}` : ""}`;
    setSearchQuery(queryStr);
    setOpenFilter(false);
    setPage(1)
  };

  return (
    <form
      onSubmit={handleFilter}
      className="products__b-pag-limits products__b-pag-limits-filter products__b-pag-lfilter-wrap"
    >
      <span
        onClick={() => setOpenFilter(false)}
        className="products__b-pag-span products__b-pag-span-close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path>
        </svg>
      </span>
      <span className="products__b-pag-lselect products__b-pag-filter-lselect">
        <span>Is active: </span>
        <span className="products__b-pag-filter-select">
          <span
            onClick={() => setOpenIsActive(!openIsActive)}
            className="products__b-pag-filter-choosed"
          >
            {isActiveValue || "--"}
            <span className="products__b-pag-span">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 14L8 10H16L12 14Z"></path>
              </svg>
            </span>
          </span>
          {openIsActive ? (
            <span className="products__b-pag-filter-options">
              <span
                onClick={() => setIsActiveValue("true")}
                className="products__b-pag-filter-option"
              >
                true
              </span>
              <span
                onClick={() => setIsActiveValue("false")}
                className="products__b-pag-filter-option"
              >
                false
              </span>
              <span
                onClick={() => setIsActiveValue("")}
                className="products__b-pag-filter-option"
              >
                --
              </span>
            </span>
          ) : null}
        </span>
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
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 14L8 10H16L12 14Z"></path>
              </svg>
            </span>
          </span>

          {openSortBy ? (
            <span className="products__b-pag-filter-options">
              <span
                onClick={() => setSortByValue("id")}
                className="products__b-pag-filter-option"
              >
                id
              </span>
              <span
                onClick={() => setSortByValue("name")}
                className="products__b-pag-filter-option"
              >
                name
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
          ) : null}
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
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 14L8 10H16L12 14Z"></path>
              </svg>
            </span>
          </span>
          {openOrder ? (
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
          ) : null}
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

export default CategoriesPaginationProperties;
