"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./pagination.modules.scss";
import { createPortal } from "react-dom";

const Pagination = ({
  data,
  localStorageName,
  openFilter,
  setOpenFilter,
  comp,
  page,
  setPage,
  limit,
  setLimit,
  search,
  setSearch,
  setQueryParams,
}) => {
  const [openLimit, setOpenLimit] = useState(false);
  const [preSearchPage, setPreSearchPage] = useState(1);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  useEffect(() => {
    if (data?.data?.meta) {
      const meta = data.data.meta;
      const totalP = meta.totalPages || 1;
      setTotalPages(totalP);
      setHasNextPage(page < totalP);
      setHasPrevPage(page > 1);
      if (totalP < page && totalP > 0) {
        handlePageChange(totalP);
      }
    }
  }, [data]);

  const executeQueryUpdate = (targetPage, targetLimit, targetSearch) => {
    setPage(targetPage);
    setLimit(targetLimit);
    setSearch(targetSearch);

    localStorage.setItem(
      localStorageName,
      JSON.stringify({ page: targetPage, limit: targetLimit, search: targetSearch })
    );

    setQueryParams((prev) => ({
      ...prev,
      paginationStr: `page=${targetPage}&limit=${targetLimit}${targetSearch ? `&search=${targetSearch}` : ""}`,
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    if (!search.trim()) setPreSearchPage(newPage);
    executeQueryUpdate(newPage, limit, search);
  };

  const handleLimitSelect = (e) => {
    const selectedLimit = Number(e.target?.id) || 8;
    executeQueryUpdate(1, selectedLimit, search);
    setOpenLimit(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    executeQueryUpdate(1, limit, search.trim());
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim() && !limit.search) {
      setPreSearchPage(page || 1);
    }
    if (!value.trim()) {      
      const restoredPage = preSearchPage || 1;
      executeQueryUpdate(restoredPage, limit, "");
    }
  };

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

  return (
    <>
      <div className="products__b-pag">
        <div className="products__b-pag-left">
          <form onSubmit={handleSearchSubmit}>
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
            <button onClick={() => setOpenLimit(!openLimit)} className="products__b-pag-lbutton">
              {limit}
              <span className="products__b-pag-span">
                <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14L8 10H16L12 14Z"></path>
                </svg>
              </span>
            </button>
            {openLimit && (
              <div className="products__b-pag-limits">
                {[4, 8, 10, 14, 18].map((id) => (
                  <span key={id} onClick={handleLimitSelect} id={String(id)} className="products__b-pag-lselect">
                    {id}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="products__b-pag-limit">
            <button ref={buttonRef} onClick={() => setOpenFilter(!openFilter)} className="products__b-pag-lbutton">
              <span className="products__b-pag-span-mini">
                <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z"></path>
                </svg>
              </span>
              <span className="products__b-pag-span">
                <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14L8 10H16L12 14Z"></path>
                </svg>
              </span>
            </button>
            {openFilter && coords?.left && coords?.top && createPortal(
              <div className="products__filter-dropdown-portal" style={{ position: "absolute", top: `${coords.top}px`, left: `${coords.left}px`, zIndex: 9999 }}>
                {comp}
              </div>,
              document.getElementById("dropdown-portal-root")
            )}
          </div>
        </div>
        <div className="products__b-pag-right">
          <button onClick={() => handlePageChange(page - 1)} disabled={!hasPrevPage} className={`products__b-pag-rbuttons ${hasPrevPage ? "" : "products__b-pag-rbuttons-disable"}`}>
            <span className="products__b-pag-span">
              <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12L13 8V16L9 12Z"></path>
              </svg>
            </span>
            Prev
          </button>
          <div className="products__b-pag-pages">
            {totalPages > 4 ? (
              <>
                <button onClick={() => handlePageChange(1)} className={`products__b-pag-page ${page === 1 ? "products__b-pag-page-active" : ""}`}>1</button>
                <button onClick={() => handlePageChange(2)} className={`products__b-pag-page ${page === 2 ? "products__b-pag-page-active" : ""}`}>2</button>
                <button onClick={() => handlePageChange(3)} className={`products__b-pag-page ${page === 3 ? "products__b-pag-page-active" : ""}`}>3</button>
                {page >= 4 && page < totalPages ? (
                  <button onClick={() => handlePageChange(page)} className="products__b-pag-page products__b-pag-page-active">{page}</button>
                ) : (
                  <button className="products__b-pag-page" type="button">
                    <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4.5 10.5C3.675 10.5 3 11.175 3 12s.675 1.5 1.5 1.5h15c.825 0 1.5-.675 1.5-1.5s-.675-1.5-1.5-1.5h-15z"></path>
                    </svg>
                  </button>
                )}
                <button onClick={() => handlePageChange(totalPages)} className={`products__b-pag-page ${page === totalPages ? "products__b-pag-page-active" : ""}`}>{totalPages}</button>
              </>
            ) : (
              Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pNum) => (
                <button key={pNum} onClick={() => handlePageChange(pNum)} className={`products__b-pag-page ${page === pNum ? "products__b-pag-page-active" : ""}`}>
                  {pNum}
                </button>
              ))
            )}
          </div>
          <button onClick={() => handlePageChange(page + 1)} disabled={!hasNextPage} className={`products__b-pag-rbuttons ${hasNextPage ? "" : "products__b-pag-rbuttons-disable"}`}>
            Next
            <span className="products__b-pag-span">
              <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 12L10 16V8L14 12Z"></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
      <div id="dropdown-portal-root"></div>
    </>
  );
};

export default Pagination;
