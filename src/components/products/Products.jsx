"use client";
import React, {useEffect, useRef, useState} from "react";
import CarProductsTable from "./ProductsTable";
import {useGetProducts} from "@/hooks/products/GetProducts";
import "./products.modules.scss";
import {useNotify} from "@/hooks/useNotify";
import ProductsSkeleton from "./ProductsLoading";
import NotFound from "../notfound/NotFound";
import {useRouter} from "next/navigation";

const Products = () => {
  const searchQuery = `?page=1&limit=10`
  const {data, isPending, error} = useGetProducts(searchQuery);
  const {notice} = useNotify();
  const route = useRouter();
  const [loaded, setLoaded] = useState(false);
  const timeRef = useRef(null);

  useEffect(() => {
    if (timeRef.current) {
      return clearTimeout(timeRef.current);
    } else {
      setTimeout(() => {
        setLoaded(true)
      }, 1000);
    }
  }, []);

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
      {(!isPending && data) && loaded ? (
        <>
          <div className="products__top">
            <h2 className="products__title">Products</h2>
            <p className="products__tit-sub">Avtomobillar ro'yxati</p>
          </div>
          <div className="products__bottom">
            <div className="products__b-pag">
              <div className="products__b-pag-left">
                {/* <input type="search" className="products__b-pag" /> */}
              </div>
            </div>
            <CarProductsTable cars={data} />
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

export default Products;
