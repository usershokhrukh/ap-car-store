"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import "../products/products.modules.scss";
import { useNotify } from "@/hooks/useNotify";
import ProductsSkeleton from "../products/ProductsLoading";
import NotFound from "../notfound/NotFound";
import { useRouter } from "next/navigation";
import { GeneralModal } from "@/context/GeneralModal";
import CategoriesTable from "./CategoriesTable";
import { useGetCategories } from "@/hooks/category/GetCategories";
import NewCategoriesModal from "../modal/categories/NewCategoriesModal";
import Pagination from "../pagination/Pagination";
import CategoriesPaginationProperties from "./CategoriesPaginationProperties";

const Categories = () => {
  const localStorageName = "categoriesLimit";
  const [loaded, setLoaded] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  // Core primitive state engines hoisted out of child components
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState("");

  // Consolidated query params object state configuration
  const [queryParams, setQueryParams] = useState(() => {
    let initialPage = 1;
    let initialLimit = 8;
    let initialSearch = "";
    let initialFilters = "";

    if (typeof window !== "undefined") {
      const savedLimit = localStorage.getItem("categoriesLimit");
      const savedFilters = localStorage.getItem("categoriesLimitAdd");

      if (savedLimit) {
        const parsed = JSON.parse(savedLimit);
        initialPage = parsed?.page || 1;
        initialLimit = parsed?.limit || 8;
        initialSearch = parsed?.search || "";
      }
      if (savedFilters) {
        const parsed = JSON.parse(savedFilters);
        initialFilters = `${parsed?.isActive ? `&isActive=${parsed?.isActive}` : ""}${parsed?.sortBy ? `&sortBy=${parsed?.sortBy}` : ""}${parsed?.order ? `&order=${parsed?.order}` : ""}`;
      }
    }

    return {
      paginationStr: `page=${initialPage}&limit=${initialLimit}${initialSearch ? `&search=${initialSearch}` : ""}`,
      filterStr: initialFilters,
    };
  });

  // Synchronize state values gracefully once when storage parsing completes on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLimit = localStorage.getItem("categoriesLimit");
      if (savedLimit) {
        const parsed = JSON.parse(savedLimit);
        setPage(parsed?.page || 1);
        setLimit(parsed?.limit || 8);
        setSearch(parsed?.search || "");
      }
    }
    setLoaded(true);
  }, []);

  // Compute our search query string dynamically without side-effect cycles
  const finalSearch = `?${queryParams.paginationStr}${queryParams.filterStr}`;
  const { data, isPending, error } = useGetCategories(finalSearch);

  const { notice } = useNotify();
  const route = useRouter();

  useEffect(() => {
    if (error?.message) {
      notice({ text: error?.message, time: "infinite", status: "error", close: "true" });
      route.refresh();
    }
  }, [error]);

  const { setCloseModal, setCompModal, setCloseSpan } = useContext(GeneralModal);
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
                <CategoriesPaginationProperties
                  localStorageName={localStorageName}
                  openFilter={openFilter}
                  setOpenFilter={setOpenFilter}
                  setPage={setPage}
                  setQueryParams={setQueryParams}
                />
              }
            />
            {data?.data?.items?.length ? (
              <CategoriesTable cars={data} />
            ) : (
              <span className="products__tit-sub">There are no products for this filter</span>
            )}
          </div>
        </>
      ) : isPending || !loaded ? (
        <ProductsSkeleton />
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default Categories;
