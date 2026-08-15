"use client";
import React, {useEffect} from "react";
import CarProductsTable from "./ProductsTable";
import {useGetProducts} from "@/hooks/products/GetProducts";
import "./products.modules.scss";
import {useNotify} from "@/hooks/useNotify";
import ProductsSkeleton from "./ProductsLoading";
import NotFound from "../notfound/NotFound";
import { useRouter } from "next/navigation";

const Products = () => {
  const {data, isPending, error} = useGetProducts();
  const {notice} = useNotify();
  const route = useRouter();

  useEffect(() => {
    if (error?.message) {
      notice({
        text: error?.message,
        time: "infinite",
        status: "error",
        close: " true",
      });
      route.refresh();
    }
  }, [error]);
  return (
    <div className="products container">
      {!isPending && data ? (
        <>
          <div className="products__top">
            <h2 className="products__title">Products</h2>
            <p className="products__tit-sub">Avtomobillar ro'yxati</p>
          </div>
          <div className="products__bottom">
            <div className="products__b-pag"></div>
            <CarProductsTable cars={data} />
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
