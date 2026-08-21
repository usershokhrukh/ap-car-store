"use client";
import React, {useContext, useEffect, useRef, useState} from "react";
import "../products/products.modules.scss";
import {useNotify} from "@/hooks/useNotify";
import ProductsSkeleton from "../products/ProductsLoading";
import NotFound from "../notfound/NotFound";
import {useRouter} from "next/navigation";
import {GeneralModal} from "@/context/GeneralModal";
import CategoriesTable from "./CategoriesTable";
import {useGetCategories} from "@/hooks/category/GetCategories";
import NewCategoriesModal from "../modal/categories/NewCategoriesModal";
import Pagination from "../pagination/Pagination";
import CategoriesPaginationProperties from "./CategoriesPaginationProperties";

const Categories = () => {
  const [localStorageName, setLocalStorageName] = useState("categoriesLimit");
  const [page, setPage] = useState(null);

  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== "undefined") {
      const savedLimit = localStorage.getItem("categoriesLimit");
      if (savedLimit) {
        const parsed = JSON.parse(savedLimit);
        return `${parsed?.page ? `page=${parsed?.page}` : ""}${parsed?.limit ? `&limit=${parsed?.limit}` : ""}${parsed?.search ? `&search=${parsed?.search}` : ""}`;
      }
    }
    return "";
  });
  const [filterSearchQuery, setFilterSearchQuery] = useState(() => {
    if (typeof window !== "undefined") {
      const savedLimit = localStorage.getItem("categoriesLimitAdd");
      if (savedLimit) {
        const parsed = JSON.parse(savedLimit);
        return `${parsed?.isActive ? `isActive=${parsed?.isActive}` : ""}${parsed?.sortBy ? `&sortBy=${parsed?.sortBy}` : ""}${parsed?.order ? `&order=${parsed?.order}` : ""}`;
      }
    }
    return "";
  });
  const [openFilter, setOpenFilter] = useState(false);
  const [finalSearch, setFinalSearch] = useState("");

  const {data, isPending, error} = useGetCategories(finalSearch);

  useEffect(() => {
    setFinalSearch(
      `${searchQuery || filterSearchQuery ? `?${searchQuery ? `${searchQuery}${filterSearchQuery ? `&${filterSearchQuery}` : ""}` : `${filterSearchQuery}${searchQuery ? `&${searchQuery}` : ""}`}` : ""}`,
    );
  }, [searchQuery, filterSearchQuery]);

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
            <Pagination
              data={data}
              localStorageName={localStorageName}
              setSearchQuery={setSearchQuery}
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
              setPage={setPage}
              page={page}
              comp={
                <CategoriesPaginationProperties
                  localStorageName={localStorageName}
                  setSearchQuery={setFilterSearchQuery}
                  openFilter={openFilter}
                  setOpenFilter={setOpenFilter}
                  setPage={setPage}
                />
              }
            />

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
    </div>
  );
};

export default Categories;
