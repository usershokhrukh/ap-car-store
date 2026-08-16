"use client";

import React, {useContext, useEffect, useState} from "react";
import "./products.modules.scss";
import "./one-product.modules.scss";
import "../../components/dashboard/dashboard.modules.scss";
import {useParams, useRouter} from "next/navigation";
import {useNotify} from "@/hooks/useNotify";
import {useGetOneProduct} from "@/hooks/products/GetOneProduct";
import NotFound from "../notfound/NotFound";
import {useGetProducts} from "@/hooks/products/GetProducts";
import ProductsViewChart from "./ProductsViewChart";
import {usePatchProducts} from "@/hooks/products/PatchProducts";
import {usePatchStatusProducts} from "@/hooks/products/PatchStatusProducts";
import { GeneralModal } from "@/context/GeneralModal";
import ProductDeleteConfirm from "./ProductDeleteConfirm";

const ProductsOneView = () => {
  const {id} = useParams();
  const route = useRouter();
  const {data, error, isPending} = useGetOneProduct(id);
  const [chartData, setChartData] = useState(null);
  const {setCloseModal, setCompModal} = useContext(GeneralModal);
  const {notice} = useNotify();
  const search = `${data?.data?.categoryId ? `?categoryId=${data?.data?.categoryId}` : ""}`;
  const {
    mutate,
    data: patchData,
    isPending: patchPending,
    error: patchError,
  } = usePatchProducts();
  const {data: categoryProducts} = useGetProducts(search);

  const handlePlus = (data) => {
    try {
      notice({
        text: "Pending...",
        time: "infinite",
        status: "info",
      });
      mutate([data?.id, {stock: data?.stock + 1}]);
    } catch (error) {
      route.refresh();
    }
  };

  const handleMinus = (data) => {
    if (data?.stock - 1 >= 0) {
      try {
        notice({
          text: "Pending...",
          time: "infinite",
          status: "info",
        });
        mutate([data?.id, {stock: data?.stock - 1}]);
      } catch (error) {
        route.refresh();
      }
    }
  };

  const {
    mutate: mutateStatus,
    data: dataStatus,
    isPending: pendingStatus,
    error: errorStatus,
  } = usePatchStatusProducts();

  const handleProductStatus = (data) => {
    try {
      notice({
        text: "Pending...",
        time: "infinite",
        status: "info",
      });
      mutateStatus([data?.id, {isActive: !data?.isActive}]);
    } catch (error) {
      route.refresh();
    }
  };

  useEffect(() => {
    if (patchError?.message) {
      notice({
        text: patchError?.message,
        status: "error",
        time: "infinite",
        close: true,
      });
      route.refresh();
    }
  }, [patchError]);

  useEffect(() => {
    if (patchData && !patchPending && !patchError?.message) {
      notice({
        text: patchData?.message,
        time: 5000,
        status: "success",
      });
    }
  }, [patchData, patchPending]);



  useEffect(() => {
    if (errorStatus?.message) {
      notice({
        text: errorStatus?.message,
        status: "error",
        time: "infinite",
        close: true,
      });
      route.refresh();
    }
  }, [errorStatus]);

  useEffect(() => {
    if (dataStatus && !pendingStatus && !errorStatus?.message) {
      notice({
        text: dataStatus?.message,
        time: 5000,
        status: "success",
      });
    }
  }, [dataStatus, pendingStatus]);

  useEffect(() => {
    if (categoryProducts?.data?.items?.length) {
      const filtered = categoryProducts?.data?.items?.map((item, index) => {
        return {name: item?.name, totalStock: item?.stock};
      });
      setChartData(filtered);
    }
  }, [categoryProducts]);

  return (
    <div className="products products-view container">
      <div className="products__top products__view-top">
        <span
          onClick={() => route.push("/products")}
          className="products__view-back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20ZM12 11H16V13H12V16L8 12L12 8V11Z"></path>
          </svg>
        </span>
      </div>
      {data && !error && !isPending ? (
        <>
          <div className="products-view__main">
            <div className="products-view__main-left">
              <ProductsViewChart data={chartData} />
              <div className="products-view__main-left-bottom">
                <div className="products-view__main-left-side">
                  <h2 className="products-view__main-title">
                    {data?.data?.name}
                  </h2>
                  <p className="products-view__main-desc">
                    {data?.data?.description}
                  </p>
                  <div className="products-view__main-box">
                    <span className="products-view__main-stock-span">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M19 20H5V21C5 21.5523 4.55228 22 4 22H3C2.44772 22 2 21.5523 2 21V13.5L0.757464 13.1894C0.312297 13.0781 0 12.6781 0 12.2192V11.5C0 11.2239 0.223858 11 0.5 11H2L4.4805 5.21216C4.79566 4.47679 5.51874 4 6.31879 4H17.6812C18.4813 4 19.2043 4.47679 19.5195 5.21216L22 11H23.5C23.7761 11 24 11.2239 24 11.5V12.2192C24 12.6781 23.6877 13.0781 23.2425 13.1894L22 13.5V21C22 21.5523 21.5523 22 21 22H20C19.4477 22 19 21.5523 19 21V20ZM20 18V13H4V18H20ZM5.47703 11H18.523C18.6502 11 18.7762 10.9757 18.8944 10.9285C19.4071 10.7234 19.6566 10.1414 19.4514 9.62861L18 6H6L4.54856 9.62861C4.50131 9.74673 4.47703 9.87278 4.47703 10C4.47703 10.5523 4.92475 11 5.47703 11ZM5 14C7.31672 14 8.87868 14.7548 9.68588 16.2643L9.68582 16.2643C9.81602 16.5078 9.72418 16.8107 9.4807 16.9409C9.40818 16.9797 9.3272 17 9.24496 17H6C5.44772 17 5 16.5523 5 16V14ZM19 14V16C19 16.5523 18.5523 17 18 17H14.755C14.6728 17 14.5918 16.9797 14.5193 16.9409C14.2758 16.8107 14.184 16.5078 14.3142 16.2643L14.3141 16.2643C15.1213 14.7548 16.6833 14 19 14Z"></path>
                      </svg>
                    </span>
                    <span onClick={() => handleProductStatus({id, isActive: data?.data?.isActive})}>
                      {data?.data?.isActive ? (
                      <span className="products-view__main-b-activate">
                        <span className="products-view__main-b-activate-act">
                          Active
                        </span>
                      </span>
                    ) : (
                      <span className="products-view__main-b-activate ">
                        <span className="products-view__main-b-activate-inact">
                          Inactive
                        </span>
                      </span>
                    )}
                    </span>
                    
                    <p className="products-view__main-price">
                      {data?.data?.price} UZS
                    </p>
                    <span className="products-view__main-stock-wr">
                      <span
                        onClick={() =>
                          handleMinus({stock: data?.data?.stock, id})
                        }
                        className="products-view__main-stock-nums"
                      >
                        -
                      </span>
                      <p className="products-view__main-stock">
                        {data?.data?.stock}
                      </p>
                      <span
                        onClick={() =>
                          handlePlus({stock: data?.data?.stock, id})
                        }
                        className="products-view__main-stock-nums"
                      >
                        +
                      </span>
                    </span>
                  </div>
                </div>
                <div className="products-view__mleft-side-right">
                  <button className="products-view__mleft-buttons">
                    <span className="products-view__mleft-buttons-span">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M16.7574 2.99678L14.7574 4.99678H5V18.9968H19V9.23943L21 7.23943V19.9968C21 20.5491 20.5523 20.9968 20 20.9968H4C3.44772 20.9968 3 20.5491 3 19.9968V3.99678C3 3.4445 3.44772 2.99678 4 2.99678H16.7574ZM20.4853 2.09729L21.8995 3.5115L12.7071 12.7039L11.2954 12.7064L11.2929 11.2897L20.4853 2.09729Z"></path>
                      </svg>
                    </span>
                  </button>

                  <button onClick={() => {
                    setCompModal(<ProductDeleteConfirm id={id}/>)
                    setCloseModal(true)
                  }} className="products-view__mleft-buttons products-view__mleft-buttons-delete">
                    <span className="products-view__mleft-buttons-span products-view__mleft-buttons-span-delete">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M4 8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8ZM6 10V20H18V10H6ZM9 12H11V18H9V12ZM13 12H15V18H13V12ZM7 5V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V5H22V7H2V5H7ZM9 4V5H15V4H9Z"></path>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className="products-view__image-container">
              <img
                className="products-view__image"
                src={data?.data?.image}
                alt={data?.data?.name}
              />

              <div className="products-view__vignette-overlay"></div>
            </div>
          </div>
          <div className="products-view__category">
            <h2 className="products-view__category-title">
              Category Properties
            </h2>
            <div className="products-view__category-main">
              <div className="products-view__category-left">
                <p className="products-view__category-name">
                  {data?.data?.category?.name}
                </p>
                <p className="products-view__category-desc">
                  {data?.data?.category?.description}
                </p>
              </div>
              {data?.data?.category?.isActive ? (
                <span className="products-view__main-b-activate">
                  <span className="products-view__main-b-activate-act">
                    Active
                  </span>
                </span>
              ) : (
                <span className="products-view__main-b-activate ">
                  <span className="products-view__main-b-activate-inact">
                    Inactive
                  </span>
                </span>
              )}
            </div>
          </div>
        </>
      ) : isPending ? (
        <>Loading...</>
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default ProductsOneView;
