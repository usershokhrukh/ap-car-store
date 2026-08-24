"use client";
import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import CarProductsTable from "./ProductsTable";
import {useGetProducts} from "@/hooks/products/GetProducts";
import "./products.modules.scss";
import {useNotify} from "@/hooks/useNotify";
import ProductsSkeleton from "./ProductsLoading";
import NotFound from "../notfound/NotFound";
import {useRouter} from "next/navigation";
import {GeneralModal} from "@/context/GeneralModal";
import NewProductsModal from "../modal/products/NewProductsModal";
import PaginationGeneral from "../pagination/PaginationGeneral";
import ProductsPaginationProperties from "./ProductsPaginationProperties";

const Products = () => {
  const localStorageName = "productsLimit";
  const listAct = ["isActive", "sortBy", "order", "categoryId", "minPrice", "maxPrice", "inStock", "pickupPointId"];
  const [searchParams, setSearchParams] = useState("");
  const {data, isPending, error} = useGetProducts(searchParams);

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
              <h2 className="products__title">Products</h2>
              <p className="products__tit-sub">Avtomobillar ro'yxati</p>
            </div>
            <button
              onClick={() => {
                setCloseModal(true);
                setCompModal(<NewProductsModal />);
              }}
              className="products__top-submit"
            >
              + Add New Car
            </button>
          </div>
          <div className="products__bottom">
            <PaginationGeneral
              comp={ProductsPaginationProperties}
              data={data}
              localStorageName={localStorageName}
              listAct={listAct}
              setSearchParams={setSearchParams}
            />
            {data?.data?.items?.length ? (
              <CarProductsTable cars={data} />
            ) : (
              <span className="products__tit-sub">
                There are not products for this filter
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

export default Products;
