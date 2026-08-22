"use client";
import React, { useEffect, useState } from "react";
import "../products/products.modules.scss";
import Pagination from "../pagination/Pagination";

const PaginationGeneral = ({
  data,
  localStorageName,
  listAct,
  setSearchParams,
  comp,
}) => {
  const [openFilter, setOpenFilter] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState("");

  const [queryParams, setQueryParams] = useState(() => {
    let initialPage = 1;
    let initialLimit = 8;
    let initialSearch = "";
    let initialFilters = "";

    if (typeof window !== "undefined") {
      const savedLimit = localStorage.getItem(localStorageName);
      const savedFilters = localStorage.getItem(localStorageName + "Add");

      if (savedLimit) {
        const parsed = JSON.parse(savedLimit);
        initialPage = parsed?.page || 1;
        initialLimit = parsed?.limit || 8;
        initialSearch = parsed?.search || "";
      }
      if (savedFilters) {
        const parsed = JSON.parse(savedFilters);
        const final = `${listAct?.map((item) => `${parsed?.[item] ? `&${item}=${parsed?.[item]}` : ""}`)}`.replaceAll(",", "");
        initialFilters = final;
      }
    }

    return {
      paginationStr: `page=${initialPage}&limit=${initialLimit}${initialSearch ? `&search=${initialSearch}` : ""}`,
      filterStr: initialFilters,
    };
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLimit = localStorage.getItem(localStorageName);
      if (savedLimit) {
        const parsed = JSON.parse(savedLimit);
        setPage(parsed?.page || 1);
        setLimit(parsed?.limit || 8);
        setSearch(parsed?.search || "");
      }
    }
    setLoaded(true);
  }, [localStorageName]);

  const finalSearch = `?${queryParams.paginationStr}${queryParams.filterStr}`;
  
  useEffect(() => {
    setSearchParams(finalSearch);
  }, [finalSearch, setSearchParams]);

  const Comp = comp;

  if (!loaded) return null;

  return (
    <Pagination
      data={data}
      localStorageName={localStorageName}
      openFilter={openFilter}
      setOpenFilter={setOpenFilter}
      page={page}
      setPage={setPage}
      limit={limit}
      setLimit={setLimit}
      search={search}
      setSearch={setSearch}
      setQueryParams={setQueryParams}
      comp={
        Comp ? (
          <Comp
            localStorageName={localStorageName}
            openFilter={openFilter}
            setOpenFilter={setOpenFilter}
            setPage={setPage}
            setQueryParams={setQueryParams}
          />
        ) : null
      }
    />
  );
};

export default PaginationGeneral;
