"use client";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "../products/products.modules.scss";
import {useNotify} from "@/hooks/useNotify";
import ProductsSkeleton from "../products/ProductsLoading";
import NotFound from "../notfound/NotFound";
import {useRouter} from "next/navigation";
import {createPortal} from "react-dom"; // Native React module feature
import {GeneralModal} from "@/context/GeneralModal";
import CategoriesTable from "./CategoriesTable";
import {useGetCategories} from "@/hooks/category/GetCategories";
import NewCategoriesModal from "../modal/categories/NewCategoriesModal";

const Categories = () => {
  const [localLimit, setLocalLimit] = useState(() => {
    if(typeof window !== "undefined") {
      const savedLimit = localStorage.getItem("categoriesLimit");
      return savedLimit ? JSON.parse(savedLimit) : null
    }
    return null
  });
  const [limit, setLimit] = useState({
    search: localLimit?.search || "",
    limit: localLimit?.limit || 8,
    page: localLimit?.page || 1,
    isActive: localLimit?.isActive || "",
    sortBy: localLimit?.sortBy || "",
    order: localLimit?.order || "",
  });

  const [windowWidth, setWindowWidth] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", () =>
        setWindowWidth(window.innerWidth),
      );
      return () =>
        window.removeEventListener("resize", () =>
          setWindowWidth(window.innerWidth),
        );
    }
  }, []);

  const [openLimit, setOpenLimit] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [openIsActive, setOpenIsActive] = useState(false);
  const [openSortBy, setOpenSortBy] = useState(false);
  const [openOrder, setOpenOrder] = useState(false);

  const searchQuery = `${limit?.page ? `?page=${limit?.page}` : ""}${limit?.limit ? `&limit=${limit?.limit}` : ""}${limit?.search ? `&search=${limit?.search}` : ""}${limit?.isActive ? `&isActive=${limit?.isActive}` : ""}${limit?.sortBy ? `&sortBy=${limit?.sortBy}` : ""}${limit?.order ? `&order=${limit?.order}` : ""}`;
  const {data, isPending, error} = useGetCategories(searchQuery);
  const {notice} = useNotify();
  const route = useRouter();
  const [loaded, setLoaded] = useState(false);
  const timeRef = useRef(null);

  useEffect(() => {
    if (timeRef.current) {
      return clearTimeout(timeRef.current);
    } else {
      setTimeout(() => {
        setLoaded(true);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (error?.message) {
      notice({
        text: error?.message,
        time: "infinite",
        status: "error",
        close: "true",
      });
      route.refresh();
    }
  }, [error]);

  const handleLimitSelect = (e) => {
    setLimit({
      ...limit,
      limit: e.target?.id || 4,
      page: 1,
    });
    localStorage.setItem(
      "categoriesLimit",
      JSON.stringify({
        ...limit,
        limit: e.target?.id || 4,
        page: 1,
      }),
    );
    setLocalLimit(JSON.parse(localStorage.getItem("categoriesLimit")));
    setPage(1);
    setOpenLimit(false);
  };

  const [coords, setCoords] = useState({top: 0, left: 0});
  const buttonRef = useRef(null);

  const updateCoords = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      const dropdownWidth = 333;
      let leftPosition = rect.left;

      if (rect.left + dropdownWidth > window.innerWidth) {
        leftPosition = window.innerWidth - dropdownWidth - 16;
      }

      setCoords({
        top: rect.bottom + window.scrollY + 8,
        left: leftPosition + window.scrollX,
      });
    }
  }, []);

  useEffect(() => {
    if (openFilter) {
      updateCoords();
      window.addEventListener("resize", updateCoords);
      window.addEventListener("scroll", updateCoords);
    }
    return () => {
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords);
    };
  }, [openFilter, updateCoords]);

  const [search, setSearch] = useState("");
  const handleSearch = (e) => {
    e.preventDefault();
    setLimit({
      ...limit,
      search,
      page: 1,
    });
    localStorage.setItem(
      "categoriesLimit",
      JSON.stringify({
        ...limit,
        search,
        page: 1,
      }),
    );
    setLocalLimit(JSON.parse(localStorage.getItem("categoriesLimit")));
  };
  const [page, setPage] = useState(null);
  const handleSearchChange = (e) => {
    const value = e.target.value.trim();
    if (value) {
      setSearch(value);
    } else {
      setLimit({
        ...limit,
        search: "",
        page,
      });

      localStorage.setItem(
        "categoriesLimit",
        JSON.stringify({
          ...limit,
          search: "",
          page,
        }),
      );
    setLocalLimit(JSON.parse(localStorage.getItem("categoriesLimit")));
      setSearch(value);
    }
  };

  const [isActiveValue, setIsActiveValue] = useState("");
  const [sortByValue, setSortByValue] = useState("");
  const [orderValue, setOrderValue] = useState("");

  useEffect(() => {
    if (localLimit) {
      setSearch(localLimit?.search);
      setIsActiveValue(localLimit?.isActive);
      setSortByValue(localLimit?.sortBy);
      setOrderValue(localLimit?.order);
      setPage(localLimit?.page);
      setLimit({
        search: localLimit?.search || "",
        limit: localLimit?.limit || 8,
        isActive: localLimit?.isActive || "",
        sortBy: localLimit?.sortBy || "",
        order: localLimit?.order || "",
        page: localLimit?.page || 1,
      });
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

    setLimit({
      ...limit,
      ...filterData,
    });

    localStorage.setItem(
      "categoriesLimit",
      JSON.stringify({
        ...limit,
        ...filterData,
      }),
    );
    setLocalLimit(JSON.parse(localStorage.getItem("categoriesLimit")));
    setOpenFilter(false);
  };

  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalPages, setTotalPages] = useState(null);

  useEffect(() => {
    if (data?.data?.meta) {
      const {totalPages, page, limit, total} = data?.data?.meta;
      setHasNextPage(page < totalPages);
      setHasPrevPage(page > 1);
      setTotalPages(totalPages);
    }
  }, [data]);

  useEffect(() => {
    if (page) {
      localStorage.setItem(
        "categoriesLimit",
        JSON.stringify({
          search: localLimit?.search || limit?.search || "",
          limit: localLimit?.limit || limit?.limit || 8,
          page,
          isActive: localLimit?.isActive || limit?.isActive || "",
          sortBy: localLimit?.sortBy || limit?.sortBy || "",
          order: localLimit?.order || limit?.order || "",
        }),
      );

      setLimit({
        search: localLimit?.search || limit?.search || "",
        limit: localLimit?.limit || limit?.limit || 8,
        page,
        isActive: localLimit?.isActive || limit?.isActive || "",
        sortBy: localLimit?.sortBy || limit?.sortBy || "",
        order: localLimit?.order || limit?.order || "",
      });
    setLocalLimit(JSON.parse(localStorage.getItem("categoriesLimit")));
    } else if (localLimit?.page) {
      setLimit({
        search: localLimit?.search || limit?.search || "",
        limit: localLimit?.limit || limit?.limit || 8,
        page :localLimit?.page || limit?.page || 1,
        isActive: localLimit?.isActive || limit?.isActive || "",
        sortBy: localLimit?.sortBy || limit?.sortBy || "",
        order: localLimit?.order || limit?.order || "",
      });
    } else {
      localStorage.setItem(
        "categoriesLimit",
        JSON.stringify({
          search: localLimit?.search || limit?.search || "",
          limit: localLimit?.limit || limit?.limit || 8,
          page: 1,
          isActive: localLimit?.isActive || limit?.isActive || "",
          sortBy: localLimit?.sortBy || limit?.sortBy || "",
          order: localLimit?.order || limit?.order || "",
        }),
      );
    setLocalLimit(JSON.parse(localStorage.getItem("categoriesLimit")));
      setLimit({
        search: localLimit?.search || limit?.search || "",
        limit: localLimit?.limit || limit?.limit || 8,
        page: 1,
        isActive: localLimit?.isActive || limit?.isActive || "",
        sortBy: localLimit?.sortBy || limit?.sortBy || "",
        order: localLimit?.order || limit?.order || "",
      });
    }
  }, [page]);

  const {setCloseModal, setCompModal, setCloseSpan} = useContext(GeneralModal);

  useEffect(() => {
    setCloseModal(false);
    setCompModal(null);
    setCloseSpan(true);
  }, []);
  return (
    <div className="products container">
      {!isPending && data && loaded ? (
        <>
          <div className="products__top">
            <div className="products__top-left">
              <h2 className="products__title">Categories</h2>
              <p className="products__tit-sub">{data?.message}</p>
            </div>
            <button
              onClick={() => {
                setCloseModal(true);
                setCompModal(<NewCategoriesModal />);
              }}
              className="products__top-submit"
            >
              + Add New Category
            </button>
          </div>
          <div className="products__bottom">
            <div className="products__b-pag">
              <div className="products__b-pag-left">
                <form onSubmit={handleSearch}>
                  <input
                    name="search"
                    type="search"
                    onChange={handleSearchChange}
                    className="products__b-pag-search"
                    placeholder="Search..."
                    value={search}
                  />
                </form>

                <div className="products__b-pag-limit">
                  <button
                    onClick={() => setOpenLimit(!openLimit)}
                    className="products__b-pag-lbutton"
                  >
                    {limit?.limit}
                    <span className="products__b-pag-span">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 14L8 10H16L12 14Z"></path>
                      </svg>
                    </span>
                  </button>
                  {openLimit ? (
                    <div className="products__b-pag-limits">
                      <span
                        onClick={handleLimitSelect}
                        id="4"
                        className="products__b-pag-lselect"
                      >
                        4
                      </span>
                      <span
                        onClick={handleLimitSelect}
                        id="8"
                        className="products__b-pag-lselect"
                      >
                        8
                      </span>
                      <span
                        onClick={handleLimitSelect}
                        id="10"
                        className="products__b-pag-lselect"
                      >
                        10
                      </span>
                      <span
                        onClick={handleLimitSelect}
                        id="14"
                        className="products__b-pag-lselect"
                      >
                        14
                      </span>
                      <span
                        onClick={handleLimitSelect}
                        id="18"
                        className="products__b-pag-lselect"
                      >
                        18
                      </span>
                    </div>
                  ) : null}
                </div>
                <div className="products__b-pag-limit">
                  <button
                    ref={buttonRef}
                    onClick={() => setOpenFilter(!openFilter)}
                    className="products__b-pag-lbutton"
                  >
                    <span className="products__b-pag-span-mini">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z"></path>
                      </svg>
                    </span>
                    <span className="products__b-pag-span">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 14L8 10H16L12 14Z"></path>
                      </svg>
                    </span>
                  </button>
                  {openFilter &&
                    coords?.left &&
                    coords?.top &&
                    createPortal(
                      <>
                        <div
                          className="products__filter-dropdown-portal"
                          style={{
                            position: "absolute",
                            top: `${coords.top}px`,
                            left: `${coords.left}px`,
                            zIndex: 9999,
                          }}
                        >
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
                                      onClick={() =>
                                        setSortByValue("createdAt")
                                      }
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
                              <button
                                type="submit"
                                className="products__b-pag-lselect-button"
                              >
                                Try
                              </button>
                            </span>
                          </form>
                        </div>
                      </>,
                      document.getElementById("dropdown-portal-root"),
                    )}
                </div>
              </div>
              <div className="products__b-pag-right">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={!hasPrevPage}
                  className={`products__b-pag-rbuttons ${hasPrevPage ? "" : "products__b-pag-rbuttons-disable"}`}
                >
                  <span className="products__b-pag-span">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 12L13 8V16L9 12Z"></path>
                    </svg>
                  </span>
                  Prev
                </button>
                <div className="products__b-pag-pages">
                  {totalPages > 4 ? (
                    <>
                      <button
                        onClick={() => setPage(1)}
                        className={`products__b-pag-page ${data?.data?.meta?.page == 1 ? "products__b-pag-page-active" : ""}`}
                      >
                        1
                      </button>
                      <button
                        onClick={() => setPage(2)}
                        className={`products__b-pag-page ${data?.data?.meta?.page == 2 ? "products__b-pag-page-active" : ""}`}
                      >
                        2
                      </button>
                      <button
                        onClick={() => setPage(3)}
                        className={`products__b-pag-page ${data?.data?.meta?.page == 3 ? "products__b-pag-page-active" : ""}`}
                      >
                        3
                      </button>

                      {page == 4 && page + 1 == totalPages ? (
                        <button
                          onClick={() => setPage(4)}
                          className="products__b-pag-page products__b-pag-page-active"
                        >
                          4
                        </button>
                      ) : page == 4 && page + 1 != totalPages ? (
                        <>
                          <button
                            onClick={() => setPage(4)}
                            className="products__b-pag-page products__b-pag-page-active"
                          >
                            4
                          </button>
                          <button className="products__b-pag-page">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M4.5 10.5C3.675 10.5 3 11.175 3 12C3 12.825 3.675 13.5 4.5 13.5C5.325 13.5 6 12.825 6 12C6 11.175 5.325 10.5 4.5 10.5ZM19.5 10.5C18.675 10.5 18 11.175 18 12C18 12.825 18.675 13.5 19.5 13.5C20.325 13.5 21 12.825 21 12C21 11.175 20.325 10.5 19.5 10.5ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"></path>
                            </svg>
                          </button>
                        </>
                      ) : page > 4 && page + 1 == totalPages ? (
                        <>
                          <button className="products__b-pag-page">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M4.5 10.5C3.675 10.5 3 11.175 3 12C3 12.825 3.675 13.5 4.5 13.5C5.325 13.5 6 12.825 6 12C6 11.175 5.325 10.5 4.5 10.5ZM19.5 10.5C18.675 10.5 18 11.175 18 12C18 12.825 18.675 13.5 19.5 13.5C20.325 13.5 21 12.825 21 12C21 11.175 20.325 10.5 19.5 10.5ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"></path>
                            </svg>
                          </button>
                          <button
                            onClick={() => setPage(page)}
                            className="products__b-pag-page products__b-pag-page-active"
                          >
                            {page}
                          </button>
                        </>
                      ) : page > 4 &&
                        page + 1 != totalPages &&
                        page != totalPages ? (
                        <>
                          <button className="products__b-pag-page">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M4.5 10.5C3.675 10.5 3 11.175 3 12C3 12.825 3.675 13.5 4.5 13.5C5.325 13.5 6 12.825 6 12C6 11.175 5.325 10.5 4.5 10.5ZM19.5 10.5C18.675 10.5 18 11.175 18 12C18 12.825 18.675 13.5 19.5 13.5C20.325 13.5 21 12.825 21 12C21 11.175 20.325 10.5 19.5 10.5ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"></path>
                            </svg>
                          </button>
                          <button
                            onClick={() => setPage(page)}
                            className="products__b-pag-page products__b-pag-page-active"
                          >
                            {page}
                          </button>
                          <button className="products__b-pag-page">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M4.5 10.5C3.675 10.5 3 11.175 3 12C3 12.825 3.675 13.5 4.5 13.5C5.325 13.5 6 12.825 6 12C6 11.175 5.325 10.5 4.5 10.5ZM19.5 10.5C18.675 10.5 18 11.175 18 12C18 12.825 18.675 13.5 19.5 13.5C20.325 13.5 21 12.825 21 12C21 11.175 20.325 10.5 19.5 10.5ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"></path>
                            </svg>
                          </button>
                        </>
                      ) : (
                        <button className="products__b-pag-page">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M4.5 10.5C3.675 10.5 3 11.175 3 12C3 12.825 3.675 13.5 4.5 13.5C5.325 13.5 6 12.825 6 12C6 11.175 5.325 10.5 4.5 10.5ZM19.5 10.5C18.675 10.5 18 11.175 18 12C18 12.825 18.675 13.5 19.5 13.5C20.325 13.5 21 12.825 21 12C21 11.175 20.325 10.5 19.5 10.5ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"></path>
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => setPage(totalPages)}
                        className={`products__b-pag-page ${data?.data?.meta?.page == totalPages ? "products__b-pag-page-active" : ""}`}
                      >
                        {totalPages}
                      </button>
                    </>
                  ) : totalPages < 4 ? (
                    <>
                      {[...Array(totalPages)]?.map((_, index) => (
                        <button
                        key={index}
                          onClick={() => setPage(index + 1)}
                          className={`products__b-pag-page ${data?.data?.meta?.page == index + 1 ? "products__b-pag-page-active" : ""}`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      {[...Array(3)]?.map((_, index) => (
                        <button
                        key={index*index}
                          onClick={() => setPage(index + 1)}
                          className={`products__b-pag-page ${data?.data?.meta?.page == index + 1 ? "products__b-pag-page-active" : ""}`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </>
                  )}
                </div>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={!hasNextPage}
                  className={`products__b-pag-rbuttons ${hasNextPage ? "" : "products__b-pag-rbuttons-disable"}`}
                >
                  Next
                  <span className="products__b-pag-span">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M14 12L10 16V8L14 12Z"></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
            {data?.data?.items?.length ? (
              <CategoriesTable cars={data} />
            ) : (
              <span className="products__tit-sub">
                There are not products for this filter
              </span>
            )}
          </div>
        </>
      ) : isPending || !loaded ? (
        <ProductsSkeleton />
      ) : (
        <NotFound />
      )}

      <div id="dropdown-portal-root"></div>
    </div>
  );
};

export default Categories;
