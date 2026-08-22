"use client";
import React, {useContext, useEffect, useState} from "react";
import "../products/products.modules.scss";
import {useNotify} from "@/hooks/useNotify";
import ProductsSkeleton from "../products/ProductsLoading";
import NotFound from "../notfound/NotFound";
import {useRouter} from "next/navigation";
import {GeneralModal} from "@/context/GeneralModal";
import CategoriesTable from "./CategoriesTable";
import {useGetCategories} from "@/hooks/category/GetCategories";
import NewCategoriesModal from "../modal/categories/NewCategoriesModal";
import CategoriesPaginationProperties from "./CategoriesPaginationProperties";
import PaginationGeneral from "../pagination/PaginationGeneral";

const Categories = () => {
  const localStorageName = "categoriesLimit";
  const listAct = ["isActive", "sortBy", "order"];
  const [searchParams, setSearchParams] = useState("");
  const {data, isPending, error} = useGetCategories(searchParams);

  const {notice} = useNotify();
  const route = useRouter();

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
      {!isPending && data ? (
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
            <PaginationGeneral comp={CategoriesPaginationProperties} data={data} localStorageName={localStorageName} listAct={listAct} setSearchParams={setSearchParams}/>
            {data?.data?.items?.length ? (
              <CategoriesTable cars={data} />
            ) : (
              <span className="products__tit-sub">
                There are no products for this filter
              </span>
            )}
          </div>
        </>
      ) : isPending ? (
        <ProductsSkeleton />
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default Categories;
